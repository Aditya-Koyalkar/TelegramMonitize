import { Hono } from "hono";
import type { AuthSession } from "../../lib/better-auth/auth-types.js";
import { Group } from "../../lib/database/models/group.model.js";

const groupRoutes = new Hono<AuthSession>();

groupRoutes.get("/groups", async (c) => {
  const user = c.get("user");
  const groups = await Group.find({
    owner: user,
  }).sort({
    createdAt: -1,
  });
  return c.json({
    success: "true",
    message: "groups fetched successfully!",
    result: groups,
  });
});

groupRoutes.post("/groups", async () => {});

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
