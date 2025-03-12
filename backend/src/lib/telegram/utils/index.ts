import bot from "../config.js";

export const generateInviteLink = async (groupId: number, userId: number) => {
  await bot.unbanChatMember(groupId, userId, { only_if_banned: true });

  const link = await bot.createChatInviteLink(groupId, {
    expire_date: Date.now() + 3600,
    member_limit: 1,
  });

  return link;
};

export async function removeUserFromGroup(chatId: number, userId: number) {
  if (!userId) {
    return;
  }

  await bot.banChatMember(chatId, userId);
}
