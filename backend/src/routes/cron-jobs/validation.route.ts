import { Hono } from "hono";
import { Subscription } from "../../lib/database/models/subscription.model.js";
import { Group } from "../../lib/database/models/group.model.js";
import { removeUserFromGroup } from "../../lib/telegram/utils/index.js";

const validateCronRoute = new Hono();

validateCronRoute.get("/ban-user", async (c) => {
  const subsriptions = await Subscription.find({
    status: "cancelled",
  });

  for (const subsription of subsriptions) {
    const group = await Group.findOne({
      _id: subsription.of_group,
    });
    if (!group) {
      return c.text("Group does not exist", 404);
    }

    await removeUserFromGroup(group.group_id, subsription.telegram_user_id);
  }

  return c.text("ok", 200);
});

export default validateCronRoute;
