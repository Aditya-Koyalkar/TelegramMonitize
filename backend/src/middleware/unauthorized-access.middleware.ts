import type { Context, Next } from "hono";

const sessionValidator = (c: Context, next: Next) => {
  const user = c.get("user");
  const path = c.req.path;
  if (path.startsWith("/api/v1/dashboard") && !user) {
    throw new Error("unauth");
  }
  return next();
};

export default sessionValidator;
