import { RequestHandler } from 'express';
import { User, UserType } from '@src/models/user.model';
import ApiError from '@src/utils/ApiError';
import httpStatus from 'http-status';

/**
 *
 */
const maxDailyRequest: RequestHandler = async (req, res, next) => {
  const user = (await User.findOne({ email: req.decodedFirebaseToken.email })) as UserType;

  const isFreeUserAtCapacity = user?.stripeStatus === 'trialing' && user.dailyRequests >= 20;

  if (isFreeUserAtCapacity) {
    next(new ApiError(httpStatus.NOT_ACCEPTABLE, 'You have 0 requests requests'));
  } else if (user.dailyRequests >= 100) {
    /**
     * spam deterence?? we pass user id along to open AI spam detection so its more likely
     * that our API calls to opanAI error if the user is making repeated requests
     */
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error'));
  }

  next();
};

export default maxDailyRequest;
