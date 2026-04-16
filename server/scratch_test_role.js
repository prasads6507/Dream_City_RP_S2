const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

const ROLE_ID = '1493620549883003031';
const GUILD_ID = '1245797634514354328';
const USER_ID = '1414678236457341071';

client.once('ready', async () => {
  console.log(`🤖 Test Bot ready as ${client.user.tag}`);
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    console.log(`✅ Found Guild: ${guild.name}`);
    
    const member = await guild.members.fetch(USER_ID);
    console.log(`✅ Found Member: ${member.user.tag}`);
    
    console.log(`⏳ Attempting to add role ${ROLE_ID}...`);
    await member.roles.add(ROLE_ID);
    console.log('✅ SUCCESS: Role added!');
  } catch (error) {
    console.error('❌ FAILURE:', error.message);
  }
  process.exit(0);
});

client.login(process.env.DISCORD_BOT_TOKEN);
