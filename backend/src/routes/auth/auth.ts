import { Hono } from "hono";
import type { AuthSession } from "../../lib/clerk/auth-types.js";
import {} from "@clerk/backend";

const route = new Hono<AuthSession>();

route.get("/session", async (c) => {
  const userId = c.get("userId");
  if (!userId) {
    return c.body(null, 401);
  }
  return c.json({ message: "authenticated" }, 200);
});

export default route;
