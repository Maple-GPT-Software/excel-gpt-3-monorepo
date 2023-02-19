import admin, { ServiceAccount } from 'firebase-admin';
// TODO: use env vars
import firebaseServiceAccount from '../firebase-service-account.json';

const app = admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount as ServiceAccount),
});

export default app;
