// @ts-nocheck
const { NODE_ENV } = process.env;

export const isProd = NODE_ENV === 'production';

// development defaults
let SIMPLIFY_BASE_URL = 'http://localhost:3000';

if (isIntegration) {
  SIMPLIFY_BASE_URL = 'int'
}

if (isProd) {
  SIMPLIFY_BASE_URL = 'prod'
};

const settings = {
  simplfyBasUrl : SIMPLIFY_BASE_URL,

}

export default settings;