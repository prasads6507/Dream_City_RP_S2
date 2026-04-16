// Authentication service — handles user sign up, sign in, sign out
// Uses Firebase Auth + Firestore to store extended user profile data

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

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
