
import {initializeApp, credential} from 'firebase-admin';
import {getAuth} from 'firebase-admin/auth';
// TODO: set this up to use env variables?
const serviceAccount = require("../../firebase-service-account.json");

const app = initializeApp({
  credential: credential.cert(serviceAccount)
});

const firebaseAuthService = getAuth(app);

export default firebaseAuthService;

