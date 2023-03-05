import morgan from 'morgan';
import config from './config';
import logger from './logger';
import { Environment } from '@src/types';

morgan.token('message', (req, res) => res.statusMessage || '');
morgan.token('source', (req, res) => {
  /** source, e.g appscript, webapp, excel */
  if (req.headers['x-source-header']) {
    return req.headers['x-source-header'] as string;
  } else {
    return '';
  }
});

const getIpFormat = () => (config.env === Environment.PROD ? ':remote-addr - ' : 'localhost -');
const successResponseFormat = `${getIpFormat()}:method :url source=:source :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url source=:source :status - :response-time ms - message: :message`;

export const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

export const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});
