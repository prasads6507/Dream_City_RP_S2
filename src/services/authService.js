// Authentication service — handles user sign up, sign in, sign out
// Uses Firebase Auth + Firestore to store extended user profile data

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  signInWithPopup,
  OAuthProvider,
  getAdditionalUserInfo
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

/**
 * Sign in with Discord OAuth
 * Returns user credential and syncs profile to Firestore
 */
export const signInWithDiscord = async () => {
  const provider = new OAuthProvider('oidc.discord');
  provider.addScope('identify');
  provider.addScope('email');
  provider.addScope('guilds');
  provider.addScope('guilds.members.read');
  
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Extract Discord profile using getAdditionalUserInfo (Standard for OIDC)
  const additionalInfo = getAdditionalUserInfo(result);
  const discordProfile = additionalInfo?.profile || {};
  
  // CRITICAL: Ensure we get the numeric Discord ID, not the Firebase UID
  // If it's not in the profile, try to find it in the providerData
  const discordUid = discordProfile.id || user.providerData.find(p => p.providerId === 'oidc.discord')?.uid;

  console.log('🤖 Discord Identity Check:', { 
    profileId: discordProfile.id, 
    providerUid: user.providerData.find(p => p.providerId === 'oidc.discord')?.uid,
    firebaseUid: user.uid 
  });

  const userData = {
    name: discordProfile.global_name || discordProfile.username || user.displayName || 'Unnamed Citizen',
    email: user.email,
    discordId: discordUid || null, // DO NOT fallback to user.uid here
    discordUsername: discordProfile.username || user.displayName,
    avatar: user.photoURL || (discordUid ? `https://cdn.discordapp.com/avatars/${discordUid}/${discordProfile.avatar}.png` : ''),
    role: 'user',
    lastLogin: serverTimestamp(),
  };

  if (!userData.discordId) {
    console.error('❌ CRITICAL ERROR: Could not capture Numeric Discord ID. Role features will be broken.');
  }

  // Sync / Create user document
  const userRef = doc(db, 'Users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, { ...userData, createdAt: serverTimestamp() });
  } else {
    // Keep existing role but update other profile info
    await setDoc(userRef, { ...userData, role: userSnap.data().role }, { merge: true });
  }

  return result;
};

/**
 * Register a new user with email/password and store profile in Firestore
 * @param {string} email
 * @param {string} password
 * @param {string} name - Display name
 * @param {string} discordUsername - Discord handle
 * @returns {Object} User credential
 */
export const signUp = async (email, password, name, discordUsername) => {
  // Create the Firebase Auth account
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update the display name on the Auth profile
  await updateProfile(user, { displayName: name });

  // Store extended user data in Firestore
  await setDoc(doc(db, 'Users', user.uid), {
    name,
    email,
    discordUsername,
    role: 'user', // Default role — manually set to 'admin' in Firebase Console
    createdAt: serverTimestamp()
  });

  return userCredential;
};

/**
 * Sign in an existing user
 * @param {string} email
 * @param {string} password
 * @returns {Object} User credential
 */
export const signIn = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  return await firebaseSignOut(auth);
};

/**
 * Fetch user data from Firestore by UID
 * @param {string} uid
 * @returns {Object|null} User data or null if not found
 */
export const getUserData = async (uid) => {
  console.log('🔍 Fetching user doc for UID:', uid);
  const docRef = doc(db, 'Users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log('✅ User data found:', data);
    return { id: docSnap.id, ...data };
  }
  console.warn('❌ No user document found in Firestore for UID:', uid);
  return null;
};

/**
 * Fetch all users from Firestore (Admin only recommended)
 * @returns {Promise<Array>} List of users
 */
export const getAllUsers = async () => {
  const { collection, getDocs } = await import('firebase/firestore');
  const querySnapshot = await getDocs(collection(db, 'Users'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Fetch admins directly from backend for better consistency and performance.
 */
export const fetchAdminsFromBackend = async () => {
  const axios = (await import('axios')).default;
  const rawUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000';
  const BACKEND_URL = rawUrl.replace(/\/$/, '');
  
  try {
    console.log('📡 Fetching Admin List from Backend...');
    const res = await axios.get(`${BACKEND_URL}/api/users`);
    return res.data.users || [];
  } catch (error) {
    console.error('Fetch Admins Failed:', error.message);
    // Fallback to client-side Firestore if backend is down
    return await getAllUsers();
  }
};

/**
 * Update a user's role in Firestore
 * @param {string} uid - Target user UID
 * @param {string} role - New role ('user', 'admin', etc.)
 */
export const updateUserRole = async (uid, role) => {
  const { doc, updateDoc } = await import('firebase/firestore');
  const userRef = doc(db, 'Users', uid);
  await updateDoc(userRef, { role });
};

/**
 * Delete a user account permanently (Auth + Doc)
 * Calls the backend API because client-side Firebase cannot delete other users' auth accounts.
 */
export const deleteAdminAccount = async (uid) => {
  const axios = (await import('axios')).default;
  const rawUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000';
  const BACKEND_URL = rawUrl.replace(/\/$/, '');
  
  try {
    const res = await axios.delete(`${BACKEND_URL}/api/users/${uid}`);
    return res.data;
  } catch (error) {
    console.error('Delete User Failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete user account');
  }
};

/**
 * Create a new Admin account silenty (via Backend)
 * This prevents the current admin from being logged out in the browser.
 */
export const createAdminAccount = async (adminData) => {
  const axios = (await import('axios')).default;
  const rawUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000';
  const BACKEND_URL = rawUrl.replace(/\/$/, '');
  
  try {
    const res = await axios.post(`${BACKEND_URL}/api/users`, adminData);
    return res.data;
  } catch (error) {
    console.error('Silent Creation Failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create admin account');
  }
};
