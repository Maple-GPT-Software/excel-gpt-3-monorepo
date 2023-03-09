// @ts-nocheck
const { NODE_ENV } = process.env;

export const isProd = NODE_ENV === 'production';

// TODO: change the SIMPLIFY_BASE_URL for production
export const SIMPLIFY_BASE_URL = isProd
  ? 'http://localhost:3000'
  : 'http://localhost:3000';
