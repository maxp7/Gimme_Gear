import { Router } from 'express';
import usersRoutes from './users';
import reservationsRoutes from './reservations';
import devicesRoutes from './devices';
import categoryRoutes from './categories';
import loginRoute from './login'; 
import adminRoutes from './admin'
import { verifyAdminToken } from './auth';



const router = Router();

router.use('/login', loginRoute);
router.use('/admin', verifyAdminToken);
router.use('/addUsers', usersRoutes);
router.use('/dbui', devicesRoutes);
router.use('/', categoryRoutes);
router.use('/admin/reservations', adminRoutes);


router.use('/reservations', reservationsRoutes);
export default router;
