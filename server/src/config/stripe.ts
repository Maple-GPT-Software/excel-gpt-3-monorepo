import Stripe from 'stripe';
import config from './config';

const stripe = new Stripe(config.stripeApi, {
  apiVersion: '2022-11-15',
});

export default stripe;
