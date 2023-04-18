import express from 'express';

import conversationRoutes from './conversation.route';
import messageRoutes from './message.route';
import paymentRoutes from './payment.route';
import authRoutes from './auth.route';

const router = express.Router();

const AppRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/message',
    route: messageRoutes,
  },
  {
    path: '/payment',
    route: paymentRoutes,
  },
  {
    path: '/conversation',
    route: conversationRoutes,
  },
];

AppRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
