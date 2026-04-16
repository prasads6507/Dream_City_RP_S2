# Firebase Setup Guide

To get your GTA RP Whitelist website working, you must connect it to your own Firebase project.

## 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the prompts.

## 2. Get Your Credentials
1. Click the **Web icon (</>)** to register a new app.
2. Copy the `firebaseConfig` object. It looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```
3. Open `src/firebase/config.js` in your code editor.
4. Replace the placeholder values with your copied credentials.

## 3. Enable Required Services

### Authentication
*   Go to **Build > Authentication > Sign-in method**.
*   Click **Add new provider** and select **Email/Password**.
*   Enable it and click **Save**.

### Firestore Database
*   Go to **Build > Firestore Database**.
*   Click **Create database**.
*   Choose **Start in test mode** for development.
*   Click **Create**.

## 4. How to Become an Admin
The Admin Dashboard is locked to users with the `admin` role.
1. Register an account on your website.
2. Go to your **Firebase Console > Firestore Database**.
3. Find the `users` collection.
4. Find your user (match your email).
5. Change the `role` field from `"user"` to `"admin"`.
6. Refresh your website, and you will see the **Admin Panel** link!

## 5. (Optional) Discord Webhook
To get notifications in Discord when someone applies:
1. In Discord, go to **Server Settings > Integrations > Webhooks**.
2. Create a new webhook and **Copy Webhook URL**.
3. Open `src/services/discordWebhook.js` and paste the URL into the `WEBHOOK_URL` variable.
