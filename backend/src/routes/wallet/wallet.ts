import { Hono } from "hono";
import type { AuthSession } from "../../lib/better-auth/auth-types.js";
import { Wallet } from "../../lib/database/models/wallet.model.js";

const walletRoute = new Hono<AuthSession>();

walletRoute.get("/wallet", async (c) => {
  const user = c.get("user")!;
  const wallet = await Wallet.findOne({ owner: user.id });

  return c.json(
    {
      success: true,
      result: wallet,
    },
    200
  );
});

export default walletRoute;
