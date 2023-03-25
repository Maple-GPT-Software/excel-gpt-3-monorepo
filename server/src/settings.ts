import { isProduction } from './config/config';

interface StripePriceIds {
  /**
   * price_id for monthly premium subscription where the user uses our openai API key
   * and gets access to premium features. We use it for free subscription signup
   * */
  premiumMonthly: string;
  /** price_id for lifetime access to chat */
  lifetimeChatAccess: string;
}

interface ISettings {
  stripePriceIds: StripePriceIds;
}

let LIFETIME_CHAT_ACCESS = 'price_1Mn9ECGB7M3KTCGBq6qXZWpG';
let PREMIUM_MONTHLY = 'price_1MdLWWGB7M3KTCGBlQufaDuk';

if (isProduction) {
  PREMIUM_MONTHLY = 'price_1MpNm7GB7M3KTCGBz7tXss9j';
  LIFETIME_CHAT_ACCESS = 'price_1MpNODGB7M3KTCGBqytn2Vg9';
}

const settings: ISettings = {
  stripePriceIds: {
    premiumMonthly: PREMIUM_MONTHLY,
    lifetimeChatAccess: LIFETIME_CHAT_ACCESS,
  },
};

export default settings;
