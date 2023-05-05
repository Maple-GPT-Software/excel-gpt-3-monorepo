const env = process.env.NODE_ENV;

export const isProd = env === 'production';
// @ts-expect-error integration is a valid type
export const isIntegration = env === 'integration';

// development defaults
let SIMPLIFY_BASE_URL = 'http://localhost:3000/api/v1';
let WEBAPP_BASE_URL = 'http://localhost:5000';
let PREMIUM_MONTHLY = 'price_1MdLWWGB7M3KTCGBlQufaDuk';
let STRIPE_CUSTOMER_PORTAL_URL =
  'https://billing.stripe.com/p/login/test_cN26q3ec609ZfrWdQQ';

if (isIntegration) {
  SIMPLIFY_BASE_URL = 'int';
  WEBAPP_BASE_URL = 'int';
  STRIPE_CUSTOMER_PORTAL_URL = 'int';
}

if (isProd) {
  SIMPLIFY_BASE_URL = 'https://excel-simplify.herokuapp.com/api/v1';
  WEBAPP_BASE_URL = 'https://www.excelsimplify.com';
  PREMIUM_MONTHLY = 'price_1N39HUGB7M3KTCGByUtRqY4T';
  STRIPE_CUSTOMER_PORTAL_URL =
    'https://billing.stripe.com/p/login/9AQeWO3939gc4da7ss';
}

const settings = {
  simplifyBaseUrl: SIMPLIFY_BASE_URL,
  webappBaseUrl: WEBAPP_BASE_URL,
  stripePriceIds: {
    premiumMonthly: PREMIUM_MONTHLY,
  },
  stripeCustomerPortalUrl: STRIPE_CUSTOMER_PORTAL_URL,
};

export default settings;
