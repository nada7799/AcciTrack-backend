const admin = require('firebase-admin');
const { initialize } = require('fireorm');
const { readFileSync } = require('node:fs');
const path = require('node:path');

const serviceAccountPath = path.resolve(process.cwd(), 'src/config', 'acitrack.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();
initialize(firestore);
async function testFirestoreConnection() {
  try {
    console.log('✅ Firestore connection successful! Check Firestore for "testConnection" collection.');
  } catch (error) {
    console.error('❌ Firestore connection failed:', error);
  }
}

testFirestoreConnection();

module.exports = { firestore };