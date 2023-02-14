import admin, { ServiceAccount } from 'firebase-admin';
// import {getAuth} from 'firebase-admin/auth';
import firebaseServiceAccount from '../firebase-service-account.json';

import config from '@src/config/config';

admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount as ServiceAccount),
});

async function verifyIdToken(token: string) {
  return admin.auth().verifyIdToken(token);
}

export default verifyIdToken;
