import { Hono } from "hono";
import type { AuthSession } from "../../lib/better-auth/auth-types.js";
import { Integration } from "../../lib/database/models/integration.model.js";
import { randomBytes } from "crypto";
import { generatePaypalAccessToken } from "../../lib/paypal/utils.js";
import { Wallet } from "../../lib/database/models/wallet.model.js";
import { paypalV1AxiosInstance } from "../../lib/axios/config.js";
import { Payout } from "../../lib/database/models/payout.model.js";
import { io } from "../../index.js";

const paypalRoute = new Hono<AuthSession>();

paypalRoute.get("connect", async (c) => {
  const user = c.get("user")!;
  const integration = await Integration.findOne({ owner: user.id });
});

paypalRoute.post("connect", async (c) => {
  const user = c.get("user")!;
  const { email } = await c.req.json();
  let integration = await Integration.findOne({ owner: user.id });
  if (integration) {
    integration = await Integration.findOneAndUpdate(
      { owner: user.id },
      {
        paypal: {
          email,
        },
      },
      {
        new: true,
      }
    );
  } else {
    integration = await Integration.create({
      owner: user.id,
      paypal: {
        email,
      },
    });
  }
  return c.json(integration);
});

paypalRoute.post("/payout", async (c) => {
  const user = c.get("user")!;
  const { amount } = await c.req.json();
  const recient = randomBytes(10).toString("hex");
  const token = await generatePaypalAccessToken();
  const integration = await Integration.findOne({
    owner: user.id,
  });
  const wallet = await Wallet.findOne({
    owner: user.id,
  });
  if (!wallet) {
    throw "Server error.No wallet found";
  }
  if (!integration) {
    return c.json(
      {
        success: true,
        message: "Integrate paypal payout account before payout",
        result: null,
      },
      200
    );
  }
  const {
    paypal: { currency, email },
  } = integration;
  const { balance } = wallet;
  if (amount > balance) {
    return c.json(
      {
        success: true,
        message: `Insufficient balance.You have ${balance}`,
        result: null,
      },
      200
    );
  }
  const resPayoutCreate = await paypalV1AxiosInstance.post(
    "/payments/payouts",
    {
      sender_batch_header: {
        sender_batch_id: `batch-${recient}`,
        email_subject: "You have a payout!",
        email_message: "You have received a payout! Thanks for using our service!",
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: { value: amount, currency: currency },
          note: "Thanks for your patronage!",
          receiver: email,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const payoutBatchId = resPayoutCreate.data.batch_header.payout_batch_id;
  const resPaypalDetails = await paypalV1AxiosInstance.get(`/payments/payouts/${payoutBatchId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const payoutItemId = resPaypalDetails.data.items[0].payout_item_id;
  const payoutItemStatus = resPaypalDetails.data.items[0].transaction_status;

  const payout = await Payout.create({
    owner: user.id,
    amount,
    paypal: {
      payout_batch_id: payoutBatchId,
      payout_item_id: payoutItemId,
    },
    status: payoutItemStatus,
  });
  io.to(user.id).emit("update-payout", "refetch");

  return c.json(
    {
      success: true,
      message: "Payout requested",
      result: payout,
    },
    200
  );
});

export default paypalRoute;
