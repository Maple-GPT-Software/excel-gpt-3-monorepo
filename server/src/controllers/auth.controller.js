// const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

// const { authService, userService, tokenService, emailService } = require('../services');

const singup = catchAsync(async () => {
  // TODO: create user profile
  console.log('signed up');
  // const user = await userService.createUser(req.body);
  // const tokens = await tokenService.generateAuthTokens(user);
  // res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async () => {
  // TODO: get profile from db and send back to client
  // const { email, password } = req.body;
  // res.send({ user, tokens });
  console.log('logged in');
});

module.exports = {
  singup,
  login,
};
