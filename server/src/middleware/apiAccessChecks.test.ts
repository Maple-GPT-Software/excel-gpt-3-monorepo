import { isStripeSubscriptionInvalid } from './subscription.middleware';

// Wed Feb 01 2023 08:00:00 GMT+0000 as unix timestamp in seconds since Epoch
const FEB_6_2023 = 1675670400;
const FEB_28_2023 = 1677571200;

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
