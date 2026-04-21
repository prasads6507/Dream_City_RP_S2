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

const DEPARTMENT_ROLES = {
  civilian: '1493620549883003031',
  police: {
    base: '1493620510465200230',
    ranks: {
      'CADET': '1493620525283676190',
      'SOLO CADET': '1493620524402872510',
      'PROBATIONARY OFFICER': '1493620517154852905',
      'OFFICER': '1493620514403389571',
      'SENIOR OFFICER': '1493620513845547069',
      'SENIOR LEAD OFFICER': '1493620512356696215',
      'LANCE CORPORAL': '1495801541054042112',
      'CORPORAL': '1495801541905612870',
      'SERGEANT': '1495801542748406073',
      'HEAD SERGEANT': '1495801567222435942',
      'LIEUTENANT': '1495801570250461367',
      'CAPTAIN': '1495801714476060672',
      'COMMANDER': '1495801714937167962',
      'ASSISTANT CHIEF': '1493620509315698803',
      'CHIEF': '1493620507889897473'
    }
  },
  ems: {
    base: '1493620529309945876',
    ranks: {
      'EMS Chief': '1493620527238221984',
      'EMS Co Chief': '1493620528232005814',
      'Paramedic': '1493620530362974360',
      'Surgeon': '1493620531231064276',
      'Doctor': '1493620532719910963',
      'Sr Doctor': '1493620537933435060',
      'Jr Doctor': '1493620538868891740',
      'Trainee': '1493620539950891010'
    }
  },
  mechanic: {
    base: '1493620542824124558',
    ranks: {
      'Mechanic Chief': '1493620541557571706',
      'Garage Manager': '1493620544107708477',
      'Asst Manager': '1493620544833191998',
      'Sr Mechanic': '1493620546418643086',
      'Jr Mechanic': '1493620547525808198',
      'Recruit': '1493620548834689075'
    }
  }
};

const GUILD_ID = process.env.DISCORD_GUILD_ID;

client.once('ready', (c) => {
  console.log(`🤖 Discord Bot logged in as ${c.user.tag}`);
});

/**
 * Assign roles to a user in the guild
 * @param {string} userId - Discord User ID
 * @param {string|string[]} roleIds - Single ID or Array of IDs
 */
async function assignGuildRole(userId, roleIds) {
  try {
    const guild = GUILD_ID 
      ? await client.guilds.fetch(GUILD_ID) 
      : client.guilds.cache.first();

    if (!guild) return { success: false, error: 'Guild not found' };

    const member = await guild.members.fetch(userId);
    if (!member) return { success: false, error: 'Member not found in server' };

    const idsToAdd = Array.isArray(roleIds) ? roleIds : [roleIds];
    
    console.log(`⏳ Attempting to add roles ${idsToAdd.join(', ')} to ${member.user.tag}...`);
    await member.roles.add(idsToAdd.filter(id => !!id));
    console.log(`✅ Assigned roles to ${member.user.tag}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Failed to assign roles to ${userId}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Surgically remove only department-specific roles from a user
 * @param {string} userInfo - Discord ID or Username
 * @param {string} type - 'police', 'ems', or 'mechanic'
 */
async function removeDepartmentRoles(userInfo, type) {
  if (!userInfo || !type || !DEPARTMENT_ROLES[type]) return { success: false, error: 'Invalid parameters' };
  
  try {
    const guild = GUILD_ID 
      ? await client.guilds.fetch(GUILD_ID) 
      : client.guilds.cache.first();

    if (!guild) return { success: false, error: 'Guild not found' };

    let member = null;
    if (/^\d+$/.test(userInfo)) {
      member = await guild.members.fetch(userInfo).catch(() => null);
    }
    
    if (!member) {
      const members = await guild.members.fetch();
      member = members.find(m => 
        m.user.username.toLowerCase() === userInfo.toLowerCase() || 
        m.user.tag.toLowerCase() === userInfo.toLowerCase()
      );
    }

    if (!member) return { success: false, error: 'Member not found' };

    // Identify all roles that belong to this department
    const deptConfig = DEPARTMENT_ROLES[type];
    let rolesToRemove = [];
    
    if (typeof deptConfig === 'string') {
      rolesToRemove = [deptConfig];
    } else {
      rolesToRemove = [deptConfig.base, ...Object.values(deptConfig.ranks || {})];
    }
    
    console.log(`⏳ Removing ${type} department roles from ${member.user.tag}...`);
    await member.roles.remove(rolesToRemove.filter(id => !!id));
    console.log(`✅ Surgically removed ${type} roles. Citizen role preserved.`);
    
    return { success: true };
  } catch (error) {
    console.error(`❌ Failed to remove department roles:`, error.message);
    return { success: false, error: error.message };
  }
}

// GIF URLs for approved/rejected (Direct Image URLs for discord embeds)
const APPROVED_GIF = 'https://gifdb.com/images/high/approved-498-x-498-gif-5cqy83ahb678q1sa.gif';
const REJECTED_GIF = 'https://www.image2url.com/r2/default/images/1776573467268-e893164b-4c67-4752-9f05-091137e5f6a1.gif';
const SCHEDULED_GIF = 'https://gifdb.com/images/high/calendar-appointment-scheduling-8v7m3m8p9n5f9p5p.gif';

/**
 * Creates the standardized embed for both DM and Channel notifications
 */
function createStatusEmbed(type, status, name, discordId, metadata = {}) {
  const isApproved = status === 'approved';
  const isScheduled = status === 'scheduled';
  
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
  const gifUrl = isApproved ? APPROVED_GIF : isScheduled ? SCHEDULED_GIF : REJECTED_GIF;
  const statusEmoji = isApproved ? '✅' : isScheduled ? '🗓️' : '❌';
  const statusText = isApproved ? 'APPROVED' : isScheduled ? 'SCHEDULED' : 'REJECTED';
  const color = isApproved ? 0x22c55e : isScheduled ? 0x06b6d4 : 0xef4444;

  let description = `**${name}**, your **${typeLabel}** application for **Dream City RP** has been **${statusText}**.`;

  if (isApproved) {
    const rankText = metadata.jobRank ? ` as a **${metadata.jobRank}**` : '';
    description = `**${name}**! Your **${typeLabel}** application for **Dream City RP** has been **APPROVED**${rankText}.\n\nWelcome to the team! 🎉`;
  } else if (isScheduled) {
    description = `**${name}**, your **${typeLabel}** application has reached the next stage! We have **SCHEDULED AN INTERVIEW** for you.\n\n📅 **Date**: ${metadata.interviewDate}\n⏰ **Time**: ${metadata.interviewTime || 'TBD'}\n\nPlease be present in the waiting room at the scheduled time.`;
  } else {
    description = `**${name}**, we regret to inform you that your **${typeLabel}** application has been **REJECTED**. You may reapply in the future.`;
  }

  const fields = [
    { name: '👤 Applicant', value: `<@${discordId}>`, inline: true },
    { name: '📋 Department', value: typeLabel, inline: true },
    { name: '📌 Status', value: statusText, inline: true }
  ];

  if (isApproved && metadata.jobRank) {
    fields.push({ name: '🎖️ Position', value: metadata.jobRank, inline: true });
  }

  if (isScheduled) {
    fields.push({ name: '📅 Interview', value: `${metadata.interviewDate} @ ${metadata.interviewTime}`, inline: false });
  }

  return {
    title: `${statusEmoji} ${typeLabel} Application ${statusText}`,
    description: description,
    color: color,
    fields: fields,
    image: { url: gifUrl },
    footer: { text: 'Dream City Roleplay • Recruitment System' },
    timestamp: new Date().toISOString()
  };
}

/**
 * Send a DM to a user by their Discord ID
 * @param {string} discordId - The user ID or username#1234 (ID is more reliable)
 * @param {string} status - 'approved', 'rejected', or 'scheduled'
 * @param {string} name - Player name for personalization
 * @param {Object} metadata - Optional interview/rank details
 */
async function sendStatusDM(discordId, status, name, type = 'Whitelist', metadata = {}) {
  try {
    const user = await client.users.fetch(discordId);
    
    if (!user) {
      console.warn(`⚠️ User not found for ID: ${discordId}`);
      return { success: false, error: 'User not found' };
    }

    const embed = createStatusEmbed(type, status, name, discordId, metadata);
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
 * @param {string} status - 'approved', 'rejected', or 'scheduled'
 * @param {string} name - Applicant name
 * @param {string} discordId - Applicant Discord ID
 * @param {Object} metadata - Optional interview/rank details
 */
async function sendChannelNotification(type, status, name, discordId, metadata = {}) {
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

    const embed = createStatusEmbed(type, status, name, discordId, metadata);
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

module.exports = { 
  sendStatusDM, 
  assignGuildRole, 
  removeDepartmentRoles, 
  sendChannelNotification,
  DEPARTMENT_ROLES 
};
