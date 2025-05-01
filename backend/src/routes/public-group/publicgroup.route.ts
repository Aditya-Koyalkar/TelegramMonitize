import { Hono } from "hono";
import { Group } from "../../lib/database/models/group.model.js";

const publicGroupRoute = new Hono();

publicGroupRoute.get("/groups/:id", async (c) => {
  const id = c.req.param("id");

  const group = await Group.findOne({ _id: id });

  return c.json(
    {
      success: true,
      message: "",
      result: group,
    },
    200
  );
});

export default publicGroupRoute;
