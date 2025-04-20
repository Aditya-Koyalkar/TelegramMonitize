import { Hono } from "hono";
import type { AuthSession } from "../../lib/better-auth/auth-types.js";
import { Group, type IGroup } from "../../lib/database/models/group.model.js";
import { ValidationError } from "../../middleware/error.middleware.js";
import paddle from "../../lib/paddle/config.js";
import { PADDLE_PRODUCT_ID } from "../../lib/env.js";

const groupRoutes = new Hono<AuthSession>();

groupRoutes.get("/groups", async (c) => {
  const user = c.get("user");
  const groups = await Group.find({
    owner: user?.id,
  }).sort({
    createdAt: -1,
  });
  return c.json({
    success: "true",
    message: "groups fetched successfully!",
    result: groups,
  });
});

groupRoutes.put("/groups", async (c) => {
  const { body } = await c.req.json();
  const priceToUpdate = (Number(body.price) * 100).toString();
  const groupInfo = await Group.findOne({ _id: body.id });

  if (!groupInfo) {
    throw new ValidationError("Group does not exist");
  }
});

groupRoutes.delete("/groups/:id", async (c) => {
  const id = c.req.param("id");
  await Group.deleteOne({ _id: id });
  return c.json({
    success: "true",
    message: "group deleted successfully",
    result: id,
  });
});

groupRoutes.post("/groups", async (c) => {
  const user = c.get("user")!;
  const { body } = await c.req.json();
  const priceToUpdate = (Number(body.price) * 100).toString();
  const groupInfo = await Group.findOne({
    _id: body.id,
  });
  if (!groupInfo) {
    throw new Error("Something went wrong.Please try again.");
  }

  let isPriceAvail: any;
  let updatedGroup: IGroup | null;

  try {
    isPriceAvail = await paddle.prices.get(groupInfo.price_id);
  } catch (error) {
    console.log("Price is not available");
  }
  if (isPriceAvail) {
    const price = await paddle.prices.update(groupInfo.price_id, {
      unitPrice: {
        amount: priceToUpdate,
        currencyCode: "USD",
      },
    });

    updatedGroup = await Group.findOneAndUpdate(
      {
        _id: body.id,
      },
      {
        price: body.price,
        price_id: price.id,
      },
      {
        new: true,
      }
    );
  } else {
    const price = await paddle.prices.create({
      name: `Price for ${groupInfo.name}`,
      productId: PADDLE_PRODUCT_ID,
      billingCycle: {
        interval: "month",
        frequency: 1,
      },
      taxMode: "external",
      description: `Created by user ${user.email}`,
      unitPrice: {
        amount: priceToUpdate,
        currencyCode: "USD",
      },
      quantity: {
        maximum: 99999999,
        minimum: 1,
      },
    });
    updatedGroup = await Group.findOneAndUpdate(
      {
        _id: body.id,
      },
      {
        price: body.price,
        price_id: price.id,
      },
      {
        new: true,
      }
    );
  }
  return c.json({ success: true, result: updatedGroup });
});

export default groupRoutes;
