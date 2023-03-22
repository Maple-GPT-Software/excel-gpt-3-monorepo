import admin from 'firebase-admin';
import config from '../config/config';

const app = admin.initializeApp({
  credential: admin.credential.cert(config.firebase),
});

export default app;
