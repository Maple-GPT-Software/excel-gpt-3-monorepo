// @ts-nocheck
const { NODE_ENV } = process.env;

export const isProd = NODE_ENV === 'production';

export const SIMPLIFY_BASE_URL = isProd ? 'prodUrl' : 'http://localhost:3000';
