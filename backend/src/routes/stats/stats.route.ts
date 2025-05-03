import { Hono } from "hono";
import type { AuthSession } from "../../lib/clerk/auth-types.js";
import { Group } from "../../lib/database/models/group.model.js";
import { Transaction } from "../../lib/database/models/transaction.model.js";
import { Customer } from "../../lib/database/models/customer.model.js";

const statsRoutes = new Hono<AuthSession>();

statsRoutes.get("/overview", async (c) => {
  const userId = c.get("userId")!;
  const last30Day = new Date();
  const last7Day = new Date();
  last30Day.setDate(last30Day.getDate() - 30);
  last7Day.setDate(last7Day.getDate() - 7);
  const groups = await Group.find({
    owner: userId,
    createdAt: {
      $gte: last30Day,
    },
  });
  const earnings = groups.reduce((sum, grp) => {
    return sum + grp.revenue;
  }, 0);
  const transactionCount = await Transaction.find({
    owner: userId,
    createdAt: { $gte: last7Day },
  }).countDocuments();
  const transactionDetails = await Transaction.find({
    owner: userId,
    createdAt: { $gte: last7Day },
  }).sort({
    createdAt: -1,
  });
  const customerCount = await Customer.findOne({
    owner: userId,
    createdAt: { $gte: last7Day },
  }).countDocuments();
  const customerDetails = await Customer.find({
    owner: userId,
    createdAt: { $gte: last7Day },
  }).sort({ createdAt: -1 });

  const result = {
    earnings: earnings || 0,
    totalCustomers: customerCount || 0,
    customerDetails: customerDetails || [],
    totalTransactions: transactionCount || 0,
    transactionDetails: transactionDetails || [],
  };

  return c.json({ status: true, message: "", result }, 200);
});

export default statsRoutes;
