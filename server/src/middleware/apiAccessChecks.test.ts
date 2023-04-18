import { isSimplifyTrialValid, isStripeSubscriptionInvalid } from './subscription.middleware.';

// Wed Feb 01 2023 08:00:00 GMT+0000 as unix timestamp in seconds since Epoch
const FEB_6_2023 = 1675670400;
const FEB_28_2023 = 1677571200;

/** SIMPLIFY trial constants */
/** Feb 11 2023 23:59:59 */
const FEB_10_2023_1_SECOND_BEFORE_MIDNIGHT = 1676102399999;
const FEB_11_2023_START = 1676102400;
/** Feb 11 2023 00:00:01 */
const FEB_11_2023_1_SECOND_PAST = 1676102401000;

describe('isSimplifyTrialValid', () => {
  it('should return true if the current date is before trial end date', () => {
    jest.useFakeTimers().setSystemTime(new Date(FEB_10_2023_1_SECOND_BEFORE_MIDNIGHT));
    expect(isSimplifyTrialValid(FEB_11_2023_START)).toBe(true);
  });
  it('should return false when the current date is past the trial end date', () => {
    jest.useFakeTimers().setSystemTime(new Date(FEB_11_2023_1_SECOND_PAST));
    expect(isSimplifyTrialValid(FEB_11_2023_START)).toBe(false);
  });
});

describe('isStripeSubscriptionInvalid', () => {
  describe('isSubscriptionInvalid free subscription tests', () => {
    it('should return true if the user does not have a stripe subscription', () => {
      expect(isStripeSubscriptionInvalid(undefined, undefined)).toBe(true);
    });

    it('should return true when current date is past current period end', () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-02-07'));

      expect(isStripeSubscriptionInvalid(FEB_6_2023, 'canceled')).toBe(true);
    });

    it('should return false when current date is before current period end', () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-02-01'));

      expect(isStripeSubscriptionInvalid(FEB_6_2023, 'trialing')).toBe(false);
    });
  });

  describe('isSubscriptionInvalid premium subscription test', () => {
    it('should return false when the user has an active subscription', () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-02-05'));
      expect(isStripeSubscriptionInvalid(FEB_28_2023, 'active')).toBe(false);
    });

    it('should return true when Stripe was not able to bill the user', () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-02-05'));
      expect(isStripeSubscriptionInvalid(FEB_28_2023, 'past_due')).toBe(true);
    });

    it('should return true when the subscription has been cancelled and current date is past current date end', () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-03-01'));
      expect(isStripeSubscriptionInvalid(FEB_28_2023, 'canceled')).toBe(true);
    });

    it('should return false when the user has a canceled subscription and the current date is before the current date end', () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-02-05'));
      expect(isStripeSubscriptionInvalid(FEB_28_2023, 'canceled')).toBe(false);
    });

    it('should return false when the user has an acive subscription', () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-02-05'));
      expect(isStripeSubscriptionInvalid(FEB_28_2023, 'active')).toBe(false);
    });
  });
});
