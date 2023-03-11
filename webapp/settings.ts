// @ts-nocheck
const { NODE_ENV } = process.env;

export const isProd = NODE_ENV === 'production';
export const isIntegration = NODE_ENV === 'integration';

// development defaults
let SIMPLIFY_BASE_URL = 'http://localhost:3000';

if (isIntegration) {
  SIMPLIFY_BASE_URL = 'int';
}

if (isProd) {
  SIMPLIFY_BASE_URL = 'prod';
}

const settings = {
  simplifyBaseUrl: SIMPLIFY_BASE_URL,
};

export default settings;
