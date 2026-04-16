import { admin, db } from './firebase-admin-init.js'; // I'll create this helper

async function checkApps() {
  const snapshot = await db.collection('whitelistApplications').orderBy('createdAt', 'desc').limit(5).get();
  snapshot.forEach(doc => {
    console.log(`App ID: ${doc.id}`);
    console.log(`Data:`, JSON.stringify(doc.data(), null, 2));
    console.log('-------------------');
  });
  process.exit(0);
}

checkApps();
