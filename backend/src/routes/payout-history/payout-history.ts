import { Hono } from "hono";
import type { AuthSession } from "../../lib/clerk/auth-types.js";
import { Payout } from "../../lib/database/models/payout.model.js";

const payoutHistoryRoutes = new Hono<AuthSession>();

payoutHistoryRoutes.get("/payout-history", async (c) => {
  const userId = c.get("userId")!;
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const payouts = await Payout.find({
    owner: userId,
    createdAt: { $gte: last7Days },
  }).sort({
    createdAt: -1,
  });
  return c.json(
    {
      status: "success",
      result: payouts,
    },
    200
  );
});

export default payoutHistoryRoutes;
