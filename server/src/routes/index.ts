import { Router } from 'express';
import usersRoutes from './users';
import reservationsRoutes from './reservations';
import devicesRoutes from './devices';
import categoryRoutes from './categories';
import loginRoute from './login'; 
import { verifyAdminToken } from './auth';

const router = Router();

router.use('/login', loginRoute);
router.use('/admin', verifyAdminToken,reservationsRoutes);
router.use('/addUsers', usersRoutes);
router.use('/dbui', devicesRoutes);
router.use('/', categoryRoutes);

export default router;
