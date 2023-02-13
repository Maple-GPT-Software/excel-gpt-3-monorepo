const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

// const { authService, userService, tokenService, emailService } = require('../services');

const signup = catchAsync(async (req, res) => {
  // TODO: create user profile
  console.log('signed up');
  // const user = await userService.createUser(req.body);
  // const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user: 'testuser' });
});

const login = catchAsync(async (req, res) => {
  // TODO: get profile from db and send back to client
  // const { email, password } = req.body;
  console.log('logged in');
  res.send({ user: 'test user' });
});

module.exports = {
  signup,
  login,
};
