import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

// TODO: how to configure this for netlify
dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
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
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'production' ? 'excel-simplify' : 'test'),
    // TODO: double check if these are all true by default
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  openAi: envVars.OPEN_AI,
  // https://answers.netlify.com/t/how-to-add-a-json-file-to-my-site-without-adding-it-to-github/82468/4
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
};
