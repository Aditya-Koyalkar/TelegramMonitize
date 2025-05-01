import { Hono } from "hono";
import { Transaction } from "../../lib/database/models/transaction.model.js";
import { Customer } from "../../lib/database/models/customer.model.js";

const orderRoute = new Hono();

orderRoute.get("/order/:key", async (c) => {
  const key = c.req.param("key");
  const transaction = await Transaction.findOne({
    anonymous_key: key,
  });
  const customer = await Customer.findOne({
    anonymous_key: key,
  });
  const result = {
    customer,
    transaction,
  };
  return c.json(
    {
      success: true,
      message: "",
      result,
    },
    200
  );
});

export default orderRoute;
