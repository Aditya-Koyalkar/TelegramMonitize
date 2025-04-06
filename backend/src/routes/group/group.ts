import { Hono } from "hono";
import type { AuthSession } from "../../lib/better-auth/auth-types.js";
import { Group } from "../../lib/database/models/group.model.js";
import { ValidationError } from "../../middleware/error.middleware.js";

const groupRoutes = new Hono<AuthSession>();

groupRoutes.get("/groups", async (c) => {
  const user = c.get("user");
  const groups = await Group.find({
    owner: user?.id,
  }).sort({
    createdAt: -1,
  });
  return c.json({
    success: "true",
    message: "groups fetched successfully!",
    result: groups,
  });
});

groupRoutes.put("/groups", async (c) => {
  const { body } = await c.req.json();
  const priceToUpdate = (Number(body.price) * 100).toString();
  const groupInfo = await Group.findOne({ _id: body.id });

  if (!groupInfo) {
    throw new ValidationError("Group does not exist");
  }
});

groupRoutes.delete("/groups/:id", async (c) => {
  const id = c.req.param("id");
  await Group.deleteOne({ _id: id });
  return c.json({
    success: "true",
    message: "group deleted successfully",
    result: id,
  });
});

export default groupRoutes;
