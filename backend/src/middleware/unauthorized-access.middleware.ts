import type { Context, Next } from "hono";
import { ValidationError } from "./error.middleware.js";

const sessionValidator = (c: Context, next: Next) => {
  const userId = c.get("userId");
  const path = c.req.path;
  if (path.startsWith("/api/v1/dashboard") && !userId) {
    throw new ValidationError(
      "Unauthorized access attempt detected.",
      {
        action: "access_protected_resource",
        requiredPermission: "user",
        receivedPermission: "unauthorized",
      },
      401
    );
  }
  return next();
};

export default sessionValidator;
