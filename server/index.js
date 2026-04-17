const express = require('express');
const cors = require('cors');
const axios = require('axios');
const admin = require('firebase-admin');
require('dotenv').config();

const { sendStatusDM, assignGuildRole } = require('./discordBot');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Simplified to allow all for production stability
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    bot: !!process.env.DISCORD_BOT_TOKEN,
    db: !!db
  });
});

// Initialize Firebase Admin
try {
  const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './firebase-admin.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('🔥 Firebase Admin initialized');
} catch (error) {
  console.warn('⚠️ Firebase Admin SDK not configured correctly. Check firebase-admin.json');
}

const db = admin.apps.length > 0 ? admin.firestore() : null;
if (!db) console.warn('❗ Firestore features are disabled (Admin SDK not initialized)');

// --- API ROUTES ---

/**
 * Notify User via Discord DM
 * POST /api/notify-user
 */
app.post('/api/notify-user', async (req, res) => {
  const { discordId, status, name, type } = req.body;
  console.log(`📬 Received /api/notify-user: ID=${discordId}, Status=${status}, User=${name}`);

  if (!discordId || !status || !name) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const result = await sendStatusDM(discordId, status, name, type);
  
  // Assign Discord role if approved
  if (status === 'approved') {
    await assignGuildRole(discordId);
  }
  
  if (result.success) {
    res.json({ success: true, message: 'Notification sent and role assigned' });
  } else {
    res.status(500).json({ success: false, message: result.error });
  }
});

/**
 * Whitelist User on FiveM (Option B: Firestore sync)
 * POST /api/whitelist-player
 */
app.post('/api/whitelist-player', async (req, res) => {
  const { discordId, name } = req.body;

  if (!discordId || !name || !db) {
    return res.status(400).json({ success: false, message: 'Missing data or DB not initialized' });
  }

  try {
    // Store in approvedPlayers collection for FiveM server to check
    await db.collection('approvedPlayers').doc(discordId).set({
      discordId,
      name,
      addedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ success: true, message: 'Player added to whitelist' });
  } catch (error) {
    console.error('❌ Whitelist error:', error);
    res.status(500).json({ success: false, message: 'Failed to update whitelist' });
  }
});

/**
 * Check for duplicate Discord ID (Public helper)
 */
app.get('/api/check-duplicate/:discordId', async (req, res) => {
  const { discordId } = req.params;
  if (!db) return res.status(500).json({ success: false, message: 'DB not initialized' });

  try {
    const q = await db.collection('whitelistApplications').where('discordId', '==', discordId).get();
    res.json({ success: true, exists: !q.empty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
