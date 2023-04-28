const { NODE_ENV } = process.env;

export const isProd = NODE_ENV === 'production';
// @ts-expect-error integration is a valid type
export const isIntegration = NODE_ENV === 'integration';

// development defaults
let SIMPLIFY_BASE_URL = 'http://localhost:3000/api/v1';
let WEBAPP_BASE_URL = 'http://127.0.0.1:5000';

if (isIntegration) {
  SIMPLIFY_BASE_URL = 'int';
  WEBAPP_BASE_URL = 'int';
}

// TODO: switch with real prod URLs
if (isProd) {
  SIMPLIFY_BASE_URL = 'https://excel-simplify.herokuapp.com/api/v1';
  WEBAPP_BASE_URL = 'https://www.excelsimplify.com';
}

const settings = {
  simplifyBaseUrl: SIMPLIFY_BASE_URL,
  webappBaseUrl: WEBAPP_BASE_URL,
};

export default settings;
