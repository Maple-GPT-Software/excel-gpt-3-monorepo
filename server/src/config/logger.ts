import { WinstonTransport as AxiomTransport } from '@axiomhq/axiom-node';
import winston from 'winston';
import config from './config';

const { errors, json, combine } = winston.format;

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: combine(
    errors({ stack: true }),
    json(),
    enumerateErrorFormat(),
    config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  defaultMeta: { service: 'excelsimplify-server' },
  transports: [
    new AxiomTransport({
      dataset: 'excel-simplify-prod',
      orgId: 'maple-gpt-6tvb',
      token: config.axiom,
    }),
  ],
});

export default logger;
