import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';
import { Environment } from '@src/types';

// TODO: how to configure this for netlify
dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid(Environment.PROD, Environment.DEV, Environment.TEST).required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL_PROD: Joi.string().required().description('Mongo PROD url required'),
    MONGODB_URL_DEV: Joi.string().optional().description('Mongo Dev url required'),
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
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const isProduction = envVars.NODE_ENV === Environment.PROD;

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: isProduction ? envVars.MONGODB_URL_PROD : envVars.MONGODB_URL_DEV,
    // useCreateIndex, useNewUrlParser, useUnifiedTopology options are true by default
    // https://www.mongodb.com/community/forums/t/option-usecreateindex-is-not-supported/123048/4
  },
  openAi: envVars.OPEN_AI,
  firebase: {
    type: envVars.FIREBASE_TYPE,
    project_id: envVars.FIREBASE_PROJECT_ID,
    private_key_id: envVars.FIREBASE_PRIVATE_KEY_ID,
    private_key: envVars.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    client_email: envVars.FIREBASE_CLIENT_EMAIL,
    client_id: envVars.FIREBASE_CLIENT_ID,
    auth_uri: envVars.FIREBASE_AUTH_URI,
    token_uri: envVars.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: envVars.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: envVars.FIREBASE_CLIENT_X509_CERT_URL,
  } as any,
  stripeApi: isProduction ? envVars.STRIPE_PROD_SECRET_KEY : envVars.STRIPE_TEST_SECRET_KEY,
  stripeEndpointSecret: isProduction ? envVars.STRIPE_PROD_ENDPOINT_SECRET : envVars.STRIPE_TEST_ENDPOINT_SECRET,
  clients: {
    // TODO: webapp production url
    webappCheckoutSuccessUrl: isProduction ? 'production_url' : 'http://127.0.0.1:5000/app/dashboard',
    webappCheckoutCancelledUrl: isProduction ? 'production_url' : 'http://127.0.0.1:5000/auth/signup',
  },
};
