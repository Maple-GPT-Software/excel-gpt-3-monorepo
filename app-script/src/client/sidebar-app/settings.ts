// @ts-nocheck
const { NODE_ENV } = process.env;

export const isProd = NODE_ENV === 'production';

let SIMPLIFY_BASE_URL = 'http://localhost:3000/api/v1';

if (isProd) {
  SIMPLIFY_BASE_URL = 'https://excel-simplify.herokuapp.com/api/v1';
}

const settings = {
  simplifyBaseUrl: SIMPLIFY_BASE_URL,
};

export default settings;
