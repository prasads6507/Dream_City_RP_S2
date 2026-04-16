const { db } = require('./firebase-admin-init.js');

async function checkApproved() {
  const snapshot = await db.collection('approvedPlayers').get();
  console.log(`Found ${snapshot.size} approved players.`);
  snapshot.forEach(doc => {
    console.log(`ID: ${doc.id}, Data:`, doc.data());
  });
  process.exit(0);
}

checkApproved();
