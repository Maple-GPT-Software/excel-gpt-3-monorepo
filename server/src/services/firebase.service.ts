import admin, { ServiceAccount } from 'firebase-admin';
// import {getAuth} from 'firebase-admin/auth';
import firebaseServiceAccount from '../firebase-service-account.json';

import config from '@src/config/config';
import logger from '@src/config/logger';

const app = admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount as ServiceAccount),
});

export default app;
