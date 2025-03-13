import client from "../../lib/better-auth/db.js";
import { Group } from "../../lib/database/models/group.model.js";
import bot from "../../lib/telegram/config.js";
import { ObjectId } from "mongodb";
const successResponse = `# 🎉 Group Successfully Registered!

Your group has been successfully registered with **Group Gain**! 🎊  

Now you can manage this group directly on the **Group Gain Platform**.  

## 🛠️ **What You Can Do:**
- Set custom subscription plans.
- Monitor group member activity.
- View revenue reports and more!

🔗 **[Login to Group Gain Platform](https://groupgain.example.com)**  
If you need help, feel free to contact us at [support@example.com](mailto:support@example.com).  

Thank you for choosing **Group Gain**! 🚀
`;

const errorResponse = `# ❌ **Oops! Something Went Wrong**

We couldn’t complete your request. This might be due to one of the following reasons:  

1. An invalid subscription key was entered.  
2. The group username is incorrect or missing.  
3. Our servers are temporarily down.  

## 🔧 **How to Fix It:**
- Double-check your subscription key and group username.  
- Make sure your group is set up with the correct permissions.  
- Try again in a few minutes.  

📧 If the problem persists, contact our support team at [support@example.com](mailto:support@example.com).  

We’re here to help you! 😊
`;

const adminErrorResponse = `# ⚠️ **Action Required: Grant Admin Privileges**

The bot doesn’t have admin privileges in your group. To proceed, please follow these steps:  

## 🛠️ **Steps to Grant Admin Privileges:**
1. Open your Telegram group settings.  
2. Go to **Administrators**.  
3. Add the bot as an administrator.  
4. Make sure to enable the following permissions:
   - Add and remove users.
   - Manage group settings.
   - Pin messages.  

Once the bot has admin privileges, you can continue using the **Group Gain** features.  

❓ Need help? Contact support at [support@example.com](mailto:support@example.com).  
`;

export const assignGroup = () => {
  bot.onText(/\/assign (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = match?.[1];
    const botInfo = await bot.getMe();
    const chatMember = await bot.getChatMember(chatId, botInfo.id);

    try {
      if (chatMember.status !== "administrator" && chatMember.status !== "creator") {
        //bot does not have admin previlages
        bot.sendMessage(chatId, adminErrorResponse, { parse_mode: "Markdown" });
        return;
      }
      if (msg.chat.title === "group" || msg.chat.title === "supergroup") {
        const groupId = msg.chat.id;
        const groupName = msg.chat.title;

        const isGroupExist = !!(await Group.findOne({
          group_id: groupId,
        }));
        if (isGroupExist) {
          bot.sendMessage(groupId, `Goup with if ${groupId} and Name: "${groupName}" is already registered`);
          return;
        }
        const newGroup = await Group.create({
          group_id: groupId,
          name: groupName,
          owner: userId,
        });
        const dbClient = client.db();
        const userCollection = dbClient.collection("user");
        await userCollection.updateOne(
          { _id: new ObjectId(userId) },
          {
            $push: {
              telegram_groups: newGroup.id,
            },
          }
        );
        bot.sendMessage(chatId, successResponse, {
          parse_mode: "Markdown",
        });
        return;
      }
      bot.sendMessage(chatId, "please provide a valid Group User-ID");
    } catch (e) {
      bot.sendMessage(chatId, errorResponse, { parse_mode: "Markdown" });
    }
  });
};
