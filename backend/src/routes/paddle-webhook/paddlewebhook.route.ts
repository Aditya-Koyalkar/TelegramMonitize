import { Hono } from "hono";
import { randomBytes } from "crypto";
import { PADDLE_SUBSCRIPTION_WEBHOOK_SECRET_KEY } from "../../lib/env.js";
import paddle from "../../lib/paddle/config.js";
import { Subscription, type ISubscription } from "../../lib/database/models/subscription.model.js";
import { Customer, type ICustomer } from "../../lib/database/models/customer.model.js";
import { Transaction, type ITransaction } from "../../lib/database/models/transaction.model.js";
import { Wallet } from "../../lib/database/models/wallet.model.js";
import { Group } from "../../lib/database/models/group.model.js";
import { io } from "../../index.js";
import resend from "../../lib/resend/config.js";

const paddleWebhookRoute = new Hono();

interface CustomData {
  customData: {
    entityType: string;
    anonymousKey: string;
    group: {
      id: string;
      owner: string;
      price: number;
      entityType: string;
      priceId: string;
    };
  };
}

paddleWebhookRoute.post("/webhook/paddle", async (c) => {
  try {
    const subscriptionKey = randomBytes(10).toString("hex");
    const signature = (c.req.header("paddle-signature") as string) || "";

    const rawRequestBody = await c.req.text();

    const secretKey = PADDLE_SUBSCRIPTION_WEBHOOK_SECRET_KEY;

    if (signature && rawRequestBody) {
      const eventData = await paddle.webhooks.unmarshal(rawRequestBody, secretKey, signature);

      const customData = (eventData.data as CustomData)?.customData;

      const userId = customData?.group?.owner;
      const groupId = customData?.group?.id;
      const priceId = customData?.group?.priceId;
      const amount = customData?.group?.price;
      const anonymousKey = customData?.anonymousKey;
      const eventInfo = eventData.data as any;

      if (eventData.eventType) {
        if (eventData.eventType === "subscription.activated") {
          const billingStart = eventInfo?.current_billing_period?.starts_at;
          const billingEnd = eventInfo?.current_billing_period?.ends_at;

          let subscription: ISubscription | null;
          let customer: ICustomer | null;
          let transaction: ITransaction | null;

          subscription = await Subscription.findOne({
            anonymous_key: anonymousKey,
          });

          if (!subscription) {
            subscription = await Subscription.create({
              owner: userId,
              of_group: groupId,
              subscription_key: subscriptionKey,
              anonymous_key: anonymousKey,
              amount,
              status: "activated",
              billing: {
                cycle: "month",
                billing_end: billingEnd,
                billing_start: billingStart,
              },
              gateway: {
                provider: "paddle",
                paddle: {
                  price_id: priceId,
                  subscription: {
                    entity_type: eventData.eventType,
                    id: eventData.data.id,
                  },
                },
              },
            });
          }

          customer = await Customer.findOne({
            anonymous_key: anonymousKey,
          });
          transaction = await Transaction.findOne({
            anonymous_key: anonymousKey,
          });

          if (customer) {
            customer = await Customer.findOneAndUpdate(
              { anonymous_key: anonymousKey },
              {
                subscription: subscription._id,
              },
              { new: true }
            );
          } else {
            let paddleCustomerInfo;
            try {
              paddleCustomerInfo = await paddle.customers.get(eventInfo.customerId);
            } catch (error) {
              console.log("Paddle customer not found");
            }

            customer = await Customer.create({
              owner: userId,
              anonymous_key: anonymousKey,
              name: paddleCustomerInfo?.name || "unknown",
              email: paddleCustomerInfo?.email || "unknown",
              subscription: subscription._id,
            });
          }

          if (transaction) {
            transaction = await Transaction.findOneAndUpdate(
              { anonymous_key: anonymousKey },
              {
                price: amount,
                subscription: subscription._id,
              },
              { new: true }
            );
          } else {
            transaction = await Transaction.create({
              owner: userId,
              price: amount,
              subscription: subscription._id,
              anonymous_key: anonymousKey,
              status: "created",
              of_group: groupId,
            });
          }

          if (customer) {
            await Subscription.updateOne({ _id: subscription._id }, { subscriber: customer._id });
          }

          const { error } = await resend.emails.send({
            from: "Telegram monitizer <support@evocreator.com>",
            to: [customer?.email as string],
            subject: "Your Subscription activation key",
            text: `Subscriber email ${customer?.email}. Subscription key ${subscriptionKey}`,
          });

          if (error) {
            return Response.json({ error }, { status: 500 });
          }

          io.to(userId).emit("update-overview", "refetch");

          return c.text("ok", 200);
        }

        if (eventData.eventType === "subscription.canceled") {
          await Subscription.updateOne({
            status: "canceled",
            gateway: {
              paddle: {
                subscription: {
                  entity_type: eventData.eventType,
                  id: eventData.data.id,
                },
              },
            },
          });

          return c.text("ok", 200);
        }

        if (eventData.eventType === "transaction.paid") {
          const transaction = await Transaction.findOne({
            anonymous_key: anonymousKey,
          });

          if (transaction) {
            await Transaction.updateOne(
              { anonymous_key: anonymousKey },
              {
                price: amount,
                status: "paid",
              }
            );
          } else {
            await Transaction.create({
              owner: userId,
              price: amount,
              status: "paid",
              anonymous_key: anonymousKey,
              of_group: groupId,
            });
          }

          Promise.all([
            await Group.updateOne(
              { owner: userId },
              {
                $inc: {
                  revenue: amount,
                },
              }
            ),
            await Wallet.updateOne(
              { owner: userId },
              {
                $inc: {
                  balance: amount,
                },
              }
            ),
          ]);

          io.to(anonymousKey).emit("txn-paid", "paid");
        }

        return c.text("ok", 200);
      }
    }
    throw "Signature missing in header";
  } catch (error) {
    console.log("Error in verifying paddle webhook: ", error);

    return c.json({ error }, 500);
  }
});

export default paddleWebhookRoute;
