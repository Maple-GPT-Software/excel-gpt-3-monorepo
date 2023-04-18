import { Response, Request } from 'express';
import rateLimit from 'express-rate-limit';
import httpStatus from 'http-status';

/** 24 hours */
const DAILY_WINDOW = 24 * 60 * 60 * 1000;
const FREE_TRIAL_MAX_DAILY_REQUESTS = 10;

/**
 * middleware to be used to check how many requests a user has made within a daily window
 * must be used after the subscriptionCheck middleware.
 */
export const dailyMessagesLimiter = rateLimit({
  windowMs: DAILY_WINDOW,
  max: () => {
    return FREE_TRIAL_MAX_DAILY_REQUESTS;
  },
  message: async (request: Request, response: Response) => {
    response.status(httpStatus.TOO_MANY_REQUESTS).send({ message: 'You can only make 20 requests per day while trialing' });
  },
  /**
   * By default express-rate-limit uses IP address to keep track of daily reqs per window
   * but we can use email-YYYY-MM-DD as key to identify user to mitigate the use of VPN to get around rate limiting
   */
  keyGenerator: async (req, res) => {
    const todayYYYYMMDD = new Date().toISOString().slice(0, 10);
    return req.decodedFirebaseToken.email + '-' + todayYYYYMMDD;
  },
  standardHeaders: true,
  legacyHeaders: false,
});
