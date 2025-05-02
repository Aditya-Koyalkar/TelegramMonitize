import bot from "../config.js";

/**
 * Generates a single-use invite link for a user
 * @param groupId - The Telegram group ID (usually negative number)
 * @param userId - The Telegram user ID to invite
 * @returns Promise with invite link object or error
 */
export const generateInviteLink = async (groupId: number, userId: number) => {
  try {
    // First check if bot has necessary permissions
    // Get bot's own ID first
    const botInfo = await bot.getMe();
    const chatMember = await bot.getChatMember(groupId, botInfo.id);

    // Check if the bot has invite permissions
    if (!chatMember.can_invite_users) {
      throw new Error("Bot does not have permission to invite users");
    }

    // Try to unban user if they were previously banned
    try {
      await bot.unbanChatMember(groupId, userId, { only_if_banned: true });
      console.log(`Successfully unbanned user ${userId} from group ${groupId}`);
    } catch (error: unknown) {
      // Type guard for error with message property
      const unbanError = error as { message?: string };

      // Log error but continue - user might not be banned
      console.warn(`Unban operation failed: ${unbanError.message || "Unknown error"}`);

      // If error is critical (not just "user not banned"), we might want to rethrow
      if (
        unbanError.message &&
        unbanError.message !== "Bad Request: PARTICIPANT_ID_INVALID" &&
        unbanError.message !== "Bad Request: USER_NOT_PARTICIPANT"
      ) {
        throw error;
      }
    }

    // Create time-limited single-use invite link
    const link = await bot.createChatInviteLink(groupId, {
      expire_date: Math.floor(Date.now() / 1000) + 3600, // expires in 1 hour
      member_limit: 1, // single-use link
      name: `Invite for user ${userId}`, // Optional: adding name for tracking
    });

    return link;
  } catch (error: unknown) {
    const typedError = error as { message?: string };
    console.error(`Failed to generate invite link: ${typedError.message || "Unknown error"}`);
    throw error; // Re-throw to let caller handle it
  }
};

/**
 * Removes a user from a group by banning them
 * @param chatId - The Telegram group ID
 * @param userId - The Telegram user ID to remove
 * @returns Promise<void>
 */
export async function removeUserFromGroup(chatId: number, userId: number) {
  if (!userId) {
    console.warn("No user ID provided for removal");
    return;
  }

  try {
    // Check if user is in the group first
    try {
      const member = await bot.getChatMember(chatId, userId);
      if (member.status === "left" || member.status === "kicked") {
        console.log(`User ${userId} is already not in the group`);
        return;
      }
    } catch (error: unknown) {
      const typedError = error as { message?: string };
      console.warn(`Could not check member status: ${typedError.message || "Unknown error"}`);
      // Continue anyway to attempt ban
    }

    // Ban the user (which removes them from the group)
    await bot.banChatMember(chatId, userId, {
      revoke_messages: false, // Set to true if you want to delete their messages
    });

    console.log(`Successfully removed user ${userId} from group ${chatId}`);
  } catch (error: unknown) {
    const typedError = error as { message?: string };
    console.error(`Failed to remove user from group: ${typedError.message || "Unknown error"}`);
    throw error; // Re-throw to let caller handle it
  }
}
