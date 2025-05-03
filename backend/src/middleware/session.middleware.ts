import type { Context, Next } from "hono";
import { getAuth } from "@hono/clerk-auth";

const addSession = async (c: Context, next: Next) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    c.set("userId", null);
    return next();
  }

  c.set("userId", auth.userId);

  return next();
};

export default addSession;
