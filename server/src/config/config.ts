import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

import { Environment } from '../types';

// TODO: how to configure this for netlify
dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid(Environment.PROD, Environment.DEV, Environment.TEST).required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL_PROD: Joi.string().required().description('Mongo PROD url required'),
    MONGODB_URL_DEV: Joi.string().optional().description('Mongo Dev url required'),
    ENCRYPT_SECRET: Joi.string().required(),
    ENCRYPT_IV: Joi.string().required(),
    OPEN_AI: Joi.string().required(),
    FIREBASE_TYPE: Joi.string().required(),
    FIREBASE_PROJECT_ID: Joi.string().required(),
    FIREBASE_PRIVATE_KEY_ID: Joi.string().required(),
    FIREBASE_PRIVATE_KEY: Joi.string().required(),
    FIREBASE_CLIENT_EMAIL: Joi.string().required(),
    FIREBASE_CLIENT_ID: Joi.string().required(),
    FIREBASE_AUTH_URI: Joi.string().required(),
    FIREBASE_TOKEN_URI: Joi.string().required(),
    FIREBASE_AUTH_PROVIDER_X509_CERT_URL: Joi.string().required(),
    FIREBASE_CLIENT_X509_CERT_URL: Joi.string().required(),
    STRIPE_TEST_SECRET_KEY: Joi.string().optional(),
    STRIPE_TEST_ENDPOINT_SECRET: Joi.string().optional(),
    STRIPE_PROD_SECRET_KEY: Joi.string().required(),
    STRIPE_PROD_ENDPOINT_SECRET: Joi.string().required(),
    AXIOM: Joi.string().required(),
    SENDGRID: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const isProduction = envVars.NODE_ENV === Environment.PROD;

const {
  NODE_ENV,
  PORT,
  MONGODB_URL_PROD,
  MONGODB_URL_DEV,
  ENCRYPT_SECRET,
  ENCRYPT_IV,
  OPEN_AI,
  FIREBASE_TYPE,
  FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY_ID,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_CLIENT_ID,
  FIREBASE_AUTH_URI,
  FIREBASE_TOKEN_URI,
  FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  FIREBASE_CLIENT_X509_CERT_URL,
  STRIPE_PROD_SECRET_KEY,
  STRIPE_TEST_SECRET_KEY,
  STRIPE_PROD_ENDPOINT_SECRET,
  STRIPE_TEST_ENDPOINT_SECRET,
  AXIOM,
  SENDGRID,
} = envVars;

export default {
  env: NODE_ENV,
  port: PORT,
  mongoose: {
    url: isProduction ? MONGODB_URL_PROD : MONGODB_URL_DEV,
    // useCreateIndex, useNewUrlParser, useUnifiedTopology options are true by default
    // https://www.mongodb.com/community/forums/t/option-usecreateindex-is-not-supported/123048/4
  },
  encrypt: {
    secretKey: ENCRYPT_SECRET,
    iv: ENCRYPT_IV,
  },
  openAi: OPEN_AI,
  firebase: {
    type: FIREBASE_TYPE,
    project_id: FIREBASE_PROJECT_ID,
    private_key_id: FIREBASE_PRIVATE_KEY_ID,
    private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    client_email: FIREBASE_CLIENT_EMAIL,
    client_id: FIREBASE_CLIENT_ID,
    auth_uri: FIREBASE_AUTH_URI,
    token_uri: FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: FIREBASE_CLIENT_X509_CERT_URL,
  } as any,
  stripeApi: isProduction ? STRIPE_PROD_SECRET_KEY : STRIPE_TEST_SECRET_KEY,
  stripeEndpointSecret: isProduction ? STRIPE_PROD_ENDPOINT_SECRET : STRIPE_TEST_ENDPOINT_SECRET,
  axiom: AXIOM,
  sendgrid: SENDGRID,
};
