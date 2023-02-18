import express from 'express';
import authRoute from './auth.route';
import completionRoute from './message.route';

const router = express.Router();

const AppRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/completion',
    route: completionRoute,
  },
];

AppRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
