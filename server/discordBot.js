const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

// Initialize Discord Bot
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.once('ready', () => {
  console.log(`🤖 Discord Bot logged in as ${client.user.tag}`);
});

/**
 * Send a DM to a user by their Discord ID
 * @param {string} discordId - The user ID or username#1234 (ID is more reliable)
 * @param {string} status - 'approved' or 'rejected'
 * @param {string} name - Player name for personalization
 */
async function sendStatusDM(discordId, status, name, type = 'Whitelist') {
  try {
    // Note: To find a user by ID, the bot must share a server with them or have them in cache
    const user = await client.users.fetch(discordId);
    
    if (!user) {
      console.warn(`⚠️ User not found for ID: ${discordId}`);
      return { success: false, error: 'User not found' };
    }

    const typeLabel = type.toUpperCase();
    const message = status === 'approved' 
      ? `✅ Hello ${name}! Your **${typeLabel}** application for **Dream City RP** has been **APPROVED**. Welcome to the department!`
      : `❌ Hello ${name}. We regret to inform you that your **${typeLabel}** application for **Dream City RP** has been **REJECTED**. You may reapply in the future.`;

    await user.send(message);
    console.log(`✉️ DM sent to ${user.tag} (${status})`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Failed to send DM to ${discordId}:`, error.message);
    if (error.code === 50007) {
      return { success: false, error: 'Cannot send messages to this user (DMs disabled)' };
    }
    return { success: false, error: error.message };
  }
}

// Log in the bot
if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_BOT_TOKEN !== 'YOUR_DISCORD_BOT_TOKEN') {
  client.login(process.env.DISCORD_BOT_TOKEN);
} else {
  console.warn('⚠️ DISCORD_BOT_TOKEN not configured. Bot will not start.');
}

module.exports = { sendStatusDM };
