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

// Initialize Firebase Admin
try {
  const fs = require('fs');
  const path = require('path');
  
  // Try several potential paths for the secret file
  const potentialPaths = [
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
    './firebase-admin.json',
    '../firebase-admin.json',
    '/app/firebase-admin.json',
    path.join(__dirname, 'firebase-admin.json'),
    path.join(__dirname, '..', 'firebase-admin.json')
  ].filter(Boolean);

  let serviceAccount = null;
  let foundPath = null;

  for (const p of potentialPaths) {
    if (fs.existsSync(p)) {
      serviceAccount = require(path.resolve(p));
      foundPath = p;
      break;
    }
  }

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log(`🔥 Firebase Admin initialized using: ${foundPath}`);
  } else {
    throw new Error('No valid firebase-admin.json found in any potential path.');
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin SDK not configured correctly. ' + error.message);
}

const db = admin.apps.length > 0 ? admin.firestore() : null;
if (!db) console.warn('❗ Firestore features are disabled (Admin SDK not initialized)');

// --- API ROUTES ---

// Health Check
app.get('/api/health', (req, res) => {
  try {
    res.json({ 
      status: 'online', 
      version: '1.2.2-stable', // Latest version identifier
      bot: !!process.env.DISCORD_BOT_TOKEN,
      db: !!db
    });
  } catch (err) {
    res.status(500).json({ error: 'Health check failed', details: err.message });
  }
});

/**
 * Filtered Staff Feed
 * GET /api/users
 */
app.get('/api/users', async (req, res) => {
  if (!db) return res.status(500).json({ success: false, message: 'DB not initialized' });
  try {
    const snapshot = await db.collection('Users').where('role', '==', 'admin').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Silent User Creation (Backend only)
 * POST /api/users
 */
app.post('/api/users', async (req, res) => {
  const { email, password, name, discordUsername, role } = req.body;
  console.log(`📡 Request to create admin: ${email}`);
  
  if (!db) return res.status(500).json({ success: false, message: 'Database system not connected.' });

  if (!email || !password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Invalid data. Password must be at least 6 characters.' });
  }

  try {
    const userRecord = await admin.auth().createUser({ email, password, displayName: name });
    const uid = userRecord.uid;

    const userData = {
      name: name || 'Unnamed Staff',
      email,
      discordUsername: discordUsername || '',
      role: role || 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('Users').doc(uid).set(userData);
    console.log(`✅ Administratively created user: ${uid} (${email})`);
    res.json({ success: true, user: { id: uid, ...userData } });
  } catch (error) {
    console.error('❌ Creation Error:', error.code, error.message);
    let userMessage = 'Failed to create account.';
    if (error.code === 'auth/email-already-exists') userMessage = 'This email is already registered.';
    if (error.code === 'auth/invalid-email') userMessage = 'The email address is invalid.';
    res.status(400).json({ success: false, message: userMessage, originalError: error.message });
  }
});

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

/**
 * Delete User (Auth + Firestore)
 * DELETE /api/users/:uid
 * Security Note: In a live app, you would verify the requester's admin token here.
 */
app.delete('/api/users/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    // 1. Delete from Firebase Auth (if they exist)
    try {
      await admin.auth().deleteUser(uid);
      console.log(`👤 Deleted Auth User: ${uid}`);
    } catch (authError) {
      if (authError.code === 'auth/user-not-found') {
        console.warn(`⚠️ User ${uid} already missing from Auth.`);
      } else {
        throw authError;
      }
    }

    // 2. Delete from Firestore (Always attempt)
    if (db) {
      await db.collection('Users').doc(uid).delete();
      console.log(`📄 Deleted Firestore Doc: ${uid}`);
    }

    res.json({ success: true, message: 'User permanently removed.' });
  } catch (error) {
    console.error('❌ Deletion failed:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
