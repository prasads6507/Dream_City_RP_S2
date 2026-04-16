const express = require('express');
const cors = require('cors');
const axios = require('axios');
const admin = require('firebase-admin');
require('dotenv').config();

const { sendStatusDM } = require('./discordBot');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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

const db = admin.firestore?.() ? admin.firestore() : null;

// --- API ROUTES ---

/**
 * Verify reCAPTCHA token
 * POST /api/verify-captcha
 */
app.post('/api/verify-captcha', async (req, res) => {
  const { token } = req.body;
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!token) return res.status(400).json({ success: false, message: 'Token is required' });

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
    );
    
    if (response.data.success) {
      res.json({ success: true, message: 'Captcha verified' });
    } else {
      res.status(400).json({ success: false, message: 'Captcha verification failed', errors: response.data['error-codes'] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * Notify User via Discord DM
 * POST /api/notify-user
 */
app.post('/api/notify-user', async (req, res) => {
  const { discordId, status, name } = req.body;

  if (!discordId || !status || !name) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const result = await sendStatusDM(discordId, status, name);
  
  if (result.success) {
    res.json({ success: true, message: 'Notification sent' });
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
