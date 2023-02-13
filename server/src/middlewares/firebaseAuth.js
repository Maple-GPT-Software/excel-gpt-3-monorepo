const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const verifyIdToken = require('../services/firebase.service');

const getAuthTokenFromHeaders = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    // eslint-disable-next-line prefer-destructuring
    req.authToken = req.headers.authorization.split(' ')[1];
  } else {
    req.authToken = null;
  }
  next();
};

/**
 * verify accessToken and attaches userId to req
 */
const firebaseAuth = () => async (req, res, next) => {
  getAuthTokenFromHeaders(req, res, async () => {
    try {
      const { authToken } = req;

      if (!authToken) {
        return new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to make this request');
      }

      const userInfo = await verifyIdToken(authToken);
      req.userId = userInfo.uid;
      return next();
    } catch (e) {
      next(e);
    }
  });
};

module.exports = firebaseAuth;
