import mongoose from 'mongoose';

import config from './config/config';
import logger from './config/logger';
import app from './app';

let server: any;

/** easy hack to get dyno IP address */
// fetch('https://httpbin.org/ip', {
//   method: 'GET',
// })
//   .then((res) => {
//     return res.json();
//   })
//   .then((data) => {
//     console.log(data);
//   });

mongoose.set('strictQuery', false);

mongoose.connect(config.mongoose.url).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port || 3000, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
