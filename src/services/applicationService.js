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
  serverTimestamp,
  onSnapshot,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import axios from 'axios';

const COLLECTION_NAME = 'whitelistApplications';
const rawUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000';
const BACKEND_URL = rawUrl.replace(/\/$/, '');


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
 * Fetch all applications for a specific Discord ID
 * @param {string} discordId 
 */
export const getUserApplications = async (discordId) => {
  if (!discordId) return [];
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('discordId', '==', discordId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Failed to fetch user applications:', error);
    return [];
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

  const result = { firestore: true, discord: false, whitelist: false, error: null };

  // 2. Trigger Backend Discord Notification
  const isNumeric = /^\d+$/.test(appData.discordId);
  
  if (!isNumeric) {
    console.error('🛑 Automation Aborted: Invalid Discord ID format (Non-numeric).');
    result.error = 'Invalid Discord ID format';
    return result;
  }

  try {
    const notifyRes = await axios.post(`${BACKEND_URL}/api/notify-user`, {
      discordId: appData.discordId,
      status: status,
      name: appData.discordName || appData.fullName,
      type: appData.type
    });
    result.discord = notifyRes.data.success;
  } catch (error) {
    console.error('Failed to send Discord notification:', error.message);
    result.error = error.message;
  }

  // 3. Trigger FiveM Whitelist if approved
  if (status === 'approved') {
    try {
      const whitelistRes = await axios.post(`${BACKEND_URL}/api/whitelist-player`, {
        discordId: appData.discordId,
        name: appData.fullName || appData.discordName
      });
      result.whitelist = whitelistRes.data.success;
    } catch (error) {
      console.error('Failed to update FiveM whitelist:', error.message);
    }
  }

  return result;
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

/**
 * Subscribe to realtime application locks
 * @param {Function} callback - Called with the new settings object
 */
export const subscribeToAppSettings = (callback) => {
  const settingsDoc = doc(db, 'System', 'appSettings');
  
  return onSnapshot(settingsDoc, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      // Default fallback if doc doesn't exist
      callback({
        policeLocked: true,
        emsLocked: true,
        mechanicLocked: true
      });
    }
  }, (error) => {
    console.error('Failed to subscribe to app settings:', error);
  });
};

/**
 * Update the lock status of a specific department
 * @param {string} departmentId - e.g., 'police', 'ems', 'mechanic'
 * @param {boolean} isLocked 
 */
export const updateAppLock = async (departmentId, isLocked) => {
  const settingsDoc = doc(db, 'System', 'appSettings');
  // Use setDoc with merge: true to create if it doesn't exist yet
  await setDoc(settingsDoc, {
    [`${departmentId}Locked`]: isLocked
  }, { merge: true });
};
