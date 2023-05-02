const env = process.env.NODE_ENV;

export const isProd = env === 'production';
// @ts-expect-error integration is a valid type
export const isIntegration = env === 'integration';

// development defaults
let SIMPLIFY_BASE_URL = 'http://localhost:3000/api/v1';
let WEBAPP_BASE_URL = 'http://127.0.0.1:5000';
let PREMIUM_MONTHLY = 'price_1MdLWWGB7M3KTCGBlQufaDuk';

if (isIntegration) {
  SIMPLIFY_BASE_URL = 'int';
  WEBAPP_BASE_URL = 'int';
}

if (isProd) {
  SIMPLIFY_BASE_URL = 'https://excel-simplify.herokuapp.com/api/v1';
  WEBAPP_BASE_URL = 'https://www.excelsimplify.com';
  PREMIUM_MONTHLY = 'price_1N39HUGB7M3KTCGByUtRqY4T';
}

const settings = {
  simplifyBaseUrl: SIMPLIFY_BASE_URL,
  webappBaseUrl: WEBAPP_BASE_URL,
  stripePriceIds: {
    premiumMonthly: PREMIUM_MONTHLY,
  },
};

export default settings;
