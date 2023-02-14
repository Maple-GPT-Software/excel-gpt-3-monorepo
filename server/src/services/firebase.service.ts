import admin, { ServiceAccount } from 'firebase-admin';
// import {getAuth} from 'firebase-admin/auth';

import config from '@src/config/config';

admin.initializeApp({
  credential: admin.credential.cert(config.firebase as ServiceAccount),
});

async function verifyIdToken(token: string) {
  return admin.auth().verifyIdToken(token);
}

export default verifyIdToken;
