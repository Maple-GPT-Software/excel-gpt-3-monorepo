/** NPM */
import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import httpStatus from 'http-status';
import config from '@src/config/config';
import * as morgan from '@src/config/morgan';
/** Middlewares */
import firebaseAuth from '@src/middleware/firebaseAuth';
import { errorHandler, errorConverter } from './middleware/error';
// import { authLimiter } from "./middlewares/rateLimiter";
/** Modules */
import AppRoutes from '@src/routes';
import ApiError from '@src/utils/ApiError';

// const corsOptions = {
//   origin: [
//     "localhost:3000",
//     ""
//   ]
// }

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// firebase authentication
app.use(firebaseAuth);

// TODO: refactor this middleware to allow email + password signup
// app.use(passport.initialize());
// passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
// if (config.env === 'production') {
//   app.use('/v1/auth', authLimiter);
// }

// v1 api routes
app.use('/', AppRoutes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
