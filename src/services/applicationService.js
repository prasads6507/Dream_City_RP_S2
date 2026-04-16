// Application service — handles whitelist application CRUD via Firestore and Backend API
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import axios from 'axios';

const COLLECTION_NAME = 'whitelistApplications';
const BACKEND_URL = 'http://localhost:5000'; // Default dev port

/**
 * Check if a Discord ID has already applied (Securely via backend)
 * @param {string} discordId 
 */
export const checkDiscordDuplicate = async (discordId) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/check-duplicate/${discordId}`);
    return res.data.exists;
  } catch (error) {
    console.error('Duplicate check failed:', error);
    return false; // Fallback to allow attempt if API is down
  }
};

/**
 * Submit an application for a specific role
 * @param {Object} data - Form data
 * @param {string} type - Application type (Civilian, EMS, Police, Mechanic)
 * @param {string} userId - Auth user UID
 */
export const submitApplication = async (data, type, userId) => {
  return await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    type,
    userId,
    status: 'pending',
    createdAt: serverTimestamp()
  });
};

/**
 * Fetch all applications (Admin)
 */
export const getAllApplications = async () => {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

/**
 * Update application status and trigger backend automation
 * @param {string} appId 
 * @param {string} status 
 * @param {Object} appData - Full application data for notification
 */
export const processApplicationDecision = async (appId, status, appData) => {
  // 1. Update Firestore
  const docRef = doc(db, COLLECTION_NAME, appId);
  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp()
  });

  // 2. Trigger Backend Discord Notification
  const isNumeric = /^\d+$/.test(appData.discordId);
  
  if (!isNumeric) {
    console.error('🛑 Automation Aborted: Invalid Discord ID format (Non-numeric).');
    return; // Stop here to prevent bot errors
  }

  try {
    await axios.post(`${BACKEND_URL}/api/notify-user`, {
      discordId: appData.discordId,
      status: status,
      name: appData.discordName || appData.fullName, // Prefer Global Name for personalization
      type: appData.type      // Include application type
    });
  } catch (error) {
    console.error('Failed to send Discord notification:', error.message);
    // Non-blocking error for UI
  }

  // 3. Trigger FiveM Whitelist if approved
  if (status === 'approved') {
    try {
      await axios.post(`${BACKEND_URL}/api/whitelist-player`, {
        discordId: appData.discordId,
        name: appData.fullName
      });
    } catch (error) {
      console.error('Failed to update FiveM whitelist:', error.message);
    }
  }
};

/**
 * Delete one or more applications
 * @param {string[]} ids 
 */
export const deleteApplications = async (ids) => {
  if (ids.length === 1) {
    return await deleteDoc(doc(db, COLLECTION_NAME, ids[0]));
  }

  const batch = writeBatch(db);
  ids.forEach(id => {
    batch.delete(doc(db, COLLECTION_NAME, id));
  });
  return await batch.commit();
};
