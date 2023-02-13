const admin = require('firebase-admin');
// TODO: set this up to use env variables?
const serviceAccount = require('../../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function verifyIdToken(idToken) {
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    return decodedIdToken;
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error);
    throw error;
  }
}

module.exports = verifyIdToken;
