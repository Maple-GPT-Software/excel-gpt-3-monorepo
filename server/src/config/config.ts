import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    FIREBASE_TYPE: Joi.string().required().description('Firebase type'),
    FIREBASE_PROJECT_ID: Joi.string().required().description('Firebase project id'),
    FIREBASE_PRIVATE_KEY_ID: Joi.string().required().description('Firebase private key id'),
    FIREBASE_PRIVATE_KEY: Joi.string().required().description('Firebase private key'),
    FIREBASE_CLIENT_EMAIL: Joi.string().required().description('Firebase client email'),
    FIREBASE_CLIENT_ID: Joi.string().required().description('Firebase client id'),
    FIREBASE_AUTH_URI: Joi.string().required().description('Firebase auth uri'),
    FIREBASE_TOKEN_URI: Joi.string().required().description('Firebase token uri'),
    FIREBASE_AUTH_PROVIDER_X509_CERT_URL: Joi.string().required().description('Firebase auth cert url'),
    FIREBASE_CLIENT_X509_CERT_URL: Joi.string().required().description('Firebase client cert url'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoose: {
        url: envVars.MONGODB_URL,
        // TODO: double check if these are all true by default
        options: {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
          },
    },
    firebase: {
        type: envVars.FIREBASE_TYPE,
        project_id: envVars.FIREBASE_PROJECT_ID,
        private_key_id: envVars.FIREBASE_PRIVATE_KEY_ID,
        private_key: envVars.FIREBASE_PRIVATE_KEY ,
        client_email: envVars.FIREBASE_CLIENT_EMAIL,
        client_id: envVars.FIREBASE_CLIENT_ID,
        auth_uri: envVars.FIREBASE_AUTH_URI ,
        token_uri: envVars.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: envVars.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: envVars.FIREBASE_CLIENT_X509_CERT_URL,

    }
}