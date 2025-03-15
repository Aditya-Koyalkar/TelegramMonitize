import { Group } from "../../lib/database/models/group.model.js";
import { Subscription } from "../../lib/database/models/subscription.model.js";
import bot from "../../lib/telegram/config.js";
import { generateInviteLink } from "../../lib/telegram/utils/index.js";

export const keyVerify = () => {
  bot.onText(/\/key (.+)/, async (msg, match) => {
    const userId = msg.from?.id; // telegram - user -id
    const chatId = msg.chat.id;
    const key = match?.[1];
    const subscription = await Subscription.findOne({
      subscription_key: key,
    });
    if (!subscription) {
      bot.sendMessage(chatId, "Key is invalid or server error occurre. Please try again.");
      return;
    }
    if (subscription.status !== "activated") {
      bot.sendMessage(chatId, "User subscription is not activated,please activate to continue");
      return;
    }
    const groupInfo = await Group.findOne({
      _id: subscription.of_group,
    });
    if (!groupInfo) {
      bot.sendMessage(chatId, "Server error");
      return;
    }
    if (userId) {
      subscription.telegram_user_id = userId;
      await subscription.save();
    }

    if (key && key === subscription.subscription_key) {
      const link = (await generateInviteLink(groupInfo.group_id, userId as number)).invite_link;
      bot.sendMessage(chatId, `Your key is valid. Invite link:  ${link}`);
      return;
    }
    bot.sendMessage(chatId, "Please provide a valid group ID");
  });
};
