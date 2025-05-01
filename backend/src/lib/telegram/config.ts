// telegramBot.ts
import TelegramBot from "node-telegram-bot-api";

let bot: TelegramBot;

if (!globalThis._telegramBot) {
  bot = new TelegramBot(process.env.TELEGRAM_TOKEN!, { polling: true });
  globalThis._telegramBot = bot;
} else {
  bot = globalThis._telegramBot;
}

export default bot;

// Extend global type (optional, for TypeScript)
declare global {
  var _telegramBot: TelegramBot | undefined;
}
