import express from 'express';
import authRoute from './auth.route';
import messageRoutes from './message.route';

const router = express.Router();

const AppRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/message',
    route: messageRoutes,
  },
];

AppRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
