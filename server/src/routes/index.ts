import express from 'express';
import authRoute from './auth.route';

const router = express.Router();

const AppRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
];

AppRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
