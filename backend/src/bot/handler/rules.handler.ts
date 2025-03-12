import bot from "../../lib/telegram/config.js";

export const rulesHandler = () => {
  bot.onText(/\/rules/, (msg) => {
    const chatId = msg.chat.id;

    const rules = `
      📜 Group Rules:
      1. Be respectful.
      2. No spamming.
      3. Use appropriate language.
      4. Follow admin instructions.
      `;

    bot.sendMessage(chatId, rules);
  });
};
