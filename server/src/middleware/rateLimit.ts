import httpStatus from 'http-status';
import logger from '@src/config/logger';
import { Response, Request } from 'express';
import rateLimit from 'express-rate-limit';
import { User, UserType } from '@src/models/user.model';
import ApiError from '@src/utils/ApiError';

/** 24 hours */
const DAILY_WINDOW = 24 * 60 * 60 * 1000;
/** I think this is very reasonable */
const PREMIUM_MAX_DAILY_REQUESTS = 100;
const FREE_TRIAL_MAX_DAILY_REQUESTS = 20;

/**
 * middleware to be used to check how many requests a user has made within a daily window
 * must be used after the subscriptionCheck middleware.
 */
export const dailyMessagesLimiter = rateLimit({
  /** 24 hour window */
  windowMs: DAILY_WINDOW,
  max: async (req, res) => {
    if (req?.isPremiumUser) {
      return PREMIUM_MAX_DAILY_REQUESTS;
    } else {
      return FREE_TRIAL_MAX_DAILY_REQUESTS;
    }
  },
  message: async (request: Request, response: Response) => {
    if (request?.isPremiumUser) {
      // FUTURE: get notified when someone hits this limit. Someone trying to attacc?
      logger.info('#dailyMessagesLimiter ', request.decodedFirebaseToken.email);
      response
        .status(httpStatus.TOO_MANY_REQUESTS)
        .send({ message: 'Our system has detected spam. Your limit will reset tomorrow.' });
    } else {
      response
        .status(httpStatus.TOO_MANY_REQUESTS)
        .send({ message: 'You can only make 20 requests per day while trialing' });
    }
  },
  /**
   * every API call will return a request. By default express-rate-limit uses IP address to keep track of daily reqs per window
   * but we can use email-YYYY-MM-DD to mitigate the use of VPN to get around our rate limit
   */
  keyGenerator: async (req, res) => {
    const todayYYYYMMDD = new Date().toISOString().slice(0, 10);
    return req.decodedFirebaseToken.email + '-' + todayYYYYMMDD;
  },
  standardHeaders: true,
  legacyHeaders: false,
});
