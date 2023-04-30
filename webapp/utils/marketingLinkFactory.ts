import {
  RegistrationParamKeys,
  RegistrationParamValues,
} from '@/types/appTypes';
import { SIGN_UP_ROUTE } from '@/constants';

const marketingLinksFactory = {
  freeTrialSignup: `${SIGN_UP_ROUTE}?${RegistrationParamKeys.SUBSCRIPTION}=${RegistrationParamValues.FREE_TRIAL}`,
  premiumSignup: `${SIGN_UP_ROUTE}?${RegistrationParamKeys.SUBSCRIPTION}=${RegistrationParamValues.PREMIUM}`,
};

export default marketingLinksFactory;
