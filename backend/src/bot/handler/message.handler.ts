import bot from "../../lib/telegram/config.js";
import { JOIN_GROUP, REGISTER_GROUP } from "../../lib/telegram/utils/constants.js";

const joinResponse = `👋 **Welcome to the Group Registration!**

To proceed, please enter your **subscription key** to join the group.  

📝 **How to Enter Your Key:**  
If you have received your subscription key via email after completing the payment, type the following command:  

\`/key <your_subscription_key>\`  

**Example:**  
\`/key key_1234\`

⚠️ **Note:**  
- Make sure to replace \`<your_subscription_key>\`with the actual key you received.  
- If you haven’t received your key or need assistance, please contact us at [support@example.com](mailto:support@example.com).  
`;

const registerResponse = `📢 To add your group, please make sure this bot has **admin permissions** in your group.  
Once done, type the following command in your group:  

\`/assign <group gain username>\`  

**Example:** \`/assign group_gain\`  

⚠️ **Note:** Replace \`<group gain username>\` with your actual group gain username. If you face any issues, contact support at [support@example.com](mailto:support@example.com).`;

export const sendMessage = () => {
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const message = msg.text?.toLowerCase();

    if (message === JOIN_GROUP.toLowerCase()) {
      bot.sendMessage(chatId, joinResponse, { parse_mode: "Markdown" });
      return;
    }

    if (message === REGISTER_GROUP.toLowerCase()) {
      bot.sendMessage(chatId, registerResponse, { parse_mode: "Markdown" });
      return;
    }
  });
};
