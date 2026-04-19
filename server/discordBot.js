const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

// Initialize Discord Bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers // Required to manage roles
  ]
});

const ROLE_ID = '1493620549883003031';
const GUILD_ID = process.env.DISCORD_GUILD_ID;

client.once('ready', (c) => {
  console.log(`🤖 Discord Bot logged in as ${c.user.tag}`);
});

/**
 * Assign a specific role to a user in the guild
 * @param {string} userId - Discord User ID
 */
async function assignGuildRole(userId) {
  try {
    const guild = GUILD_ID 
      ? await client.guilds.fetch(GUILD_ID) 
      : client.guilds.cache.first();

    if (!guild) {
      console.error('❌ Could not find Discord Guild. Please set DISCORD_GUILD_ID in .env');
      return { success: false, error: 'Guild not found' };
    }

    const member = await guild.members.fetch(userId);
    if (!member) {
      console.error(`❌ Member ${userId} not found in guild ${guild.name}. Are they in the server?`);
      return { success: false, error: 'Member not found in server' };
    }

    console.log(`⏳ Attempting to add role ${ROLE_ID} to ${member.user.tag}...`);
    await member.roles.add(ROLE_ID);
    console.log(`✅ Assigned role ${ROLE_ID} to ${member.user.tag}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Failed to assign role to ${userId}:`, error.message);
    return { success: false, error: error.message };
  }
}

// GIF URLs for approved/rejected (Direct Image URLs for discord embeds)
const APPROVED_GIF = 'https://gifdb.com/images/high/approved-498-x-498-gif-5cqy83ahb678q1sa.gif';
const REJECTED_GIF = 'https://media1.tenor.com/m/fbTDTvJHJmgAAAAC/rejected.gif';

/**
 * Creates the standardized embed for both DM and Channel notifications
 */
function createStatusEmbed(type, status, name, discordId) {
  const isApproved = status === 'approved';
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
  const gifUrl = isApproved ? APPROVED_GIF : REJECTED_GIF;
  const statusEmoji = isApproved ? '✅' : '❌';
  const statusText = isApproved ? 'APPROVED' : 'REJECTED';
  const color = isApproved ? 0x22c55e : 0xef4444;

  const description = isApproved
    ? `**${name}**! Your **${typeLabel}** application for **Dream City RP** has been **APPROVED**.\n\nWelcome to the Dream City Roleplay S2! 🎉`
    : `**${name}**, we regret to inform you that your **${typeLabel}** application for **Dream City RP** has been **REJECTED**.\n\nYou may reapply in the future.`;

  return {
    title: `${statusEmoji} ${typeLabel} Application ${statusText}`,
    description: description,
    color: color,
    fields: [
      { name: '👤 Applicant', value: `<@${discordId}>`, inline: true },
      { name: '📋 Department', value: typeLabel, inline: true },
      { name: '📌 Status', value: statusText, inline: true }
    ],
    image: { url: gifUrl },
    footer: { text: 'Dream City Roleplay • Staff Management' },
    timestamp: new Date().toISOString()
  };
}

/**
 * Send a DM to a user by their Discord ID
 * @param {string} discordId - The user ID or username#1234 (ID is more reliable)
 * @param {string} status - 'approved' or 'rejected'
 * @param {string} name - Player name for personalization
 */
async function sendStatusDM(discordId, status, name, type = 'Whitelist') {
  try {
    const user = await client.users.fetch(discordId);
    
    if (!user) {
      console.warn(`⚠️ User not found for ID: ${discordId}`);
      return { success: false, error: 'User not found' };
    }

    const embed = createStatusEmbed(type, status, name, discordId);
    await user.send({ embeds: [embed] });
    
    console.log(`✉️ DM Embed sent to ${user.tag} (${status})`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Failed to send DM to ${discordId}:`, error.message);
    if (error.code === 50007) {
      return { success: false, error: 'Cannot send messages to this user (DMs disabled)' };
    }
    return { success: false, error: error.message };
  }
}

// Department Channel IDs
const DEPARTMENT_CHANNELS = {
  police: '1493620877231915150',
  ems: '1493620878938734662',
  mechanic: '1493620879798567035'
};

/**
 * Send a notification to the department-specific Discord channel
 * @param {string} type - 'police', 'ems', 'mechanic', or 'civilian'
 * @param {string} status - 'approved' or 'rejected'
 * @param {string} name - Applicant name
 * @param {string} discordId - Applicant Discord ID
 */
async function sendChannelNotification(type, status, name, discordId) {
  try {
    const channelId = DEPARTMENT_CHANNELS[type];
    if (!channelId) {
      console.log(`ℹ️ No channel configured for type: ${type}, skipping channel notification.`);
      return { success: false, error: 'No channel for this department' };
    }

    const channel = await client.channels.fetch(channelId);
    if (!channel) {
      console.error(`❌ Could not find channel: ${channelId}`);
      return { success: false, error: 'Channel not found' };
    }

    const embed = createStatusEmbed(type, status, name, discordId);
    await channel.send({ embeds: [embed] });
    
    console.log(`📢 Channel notification sent to #${channel.name} for ${name} (${status})`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Failed to send channel notification:`, error.message);
    return { success: false, error: error.message };
  }
}

// Log in the bot
if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_BOT_TOKEN !== 'YOUR_DISCORD_BOT_TOKEN') {
  client.login(process.env.DISCORD_BOT_TOKEN);
} else {
  console.warn('⚠️ DISCORD_BOT_TOKEN not configured. Bot will not start.');
}

module.exports = { sendStatusDM, assignGuildRole, sendChannelNotification };
