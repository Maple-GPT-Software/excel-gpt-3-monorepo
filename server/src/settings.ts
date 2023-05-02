import { isProduction } from './config/config';

interface StripePriceIds {
  /**
   * price_id for monthly premium subscription where the user uses our openai API key
   * and gets access to premium features. We use it for free trial signup
   * */
  premiumMonthly: string;
}

interface ISettings {
  stripePriceIds: StripePriceIds;
}

let PREMIUM_MONTHLY = 'price_1MdLWWGB7M3KTCGBlQufaDuk';

if (isProduction) {
  PREMIUM_MONTHLY = 'price_1N39HUGB7M3KTCGByUtRqY4T';
}

// FUTURE: other price ids
const settings: ISettings = {
  stripePriceIds: {
    premiumMonthly: PREMIUM_MONTHLY,
  },
};

export default settings;
