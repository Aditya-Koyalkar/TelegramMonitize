import { Hono } from "hono";
import type { AuthSession } from "../../lib/better-auth/auth-types.js";

const route = new Hono<AuthSession>();

route.get("/session", async (c) => {
  const user = c.get("user");
  const session = c.get("session");
  if (!user) {
    return c.body(null, 401);
  }
  return c.json({ session, user }, 200);
});

export default route;
