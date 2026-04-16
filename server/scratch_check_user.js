const { db } = require('./firebase-admin-init.js');

async function checkUser() {
  const uid = 'yicsYi3gNDa9UsWSQER4zysA2tp2';
  const doc = await db.collection('Users').doc(uid).get();
  if (doc.exists) {
    console.log(`User Doc:`, JSON.stringify(doc.data(), null, 2));
  } else {
    console.log('User not found');
  }
  process.exit(0);
}

checkUser();
