import { Hono } from "hono";
import type { AuthSession } from "../../lib/clerk/auth-types.js";
import { Wallet } from "../../lib/database/models/wallet.model.js";

const walletRoute = new Hono<AuthSession>();

walletRoute.get("/wallet", async (c) => {
  const userId = c.get("userId")!;
  const wallet = await Wallet.findOne({ owner: userId });

  return c.json(
    {
      success: true,
      result: wallet,
    },
    200
  );
});

export default walletRoute;
