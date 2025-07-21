import { Router } from 'express';
import usersRoutes from './users';
import reservationsRoutes from './reservations';
import devicesRoutes from './devices';
import categoryRoutes from './categories';
import loginRoute from './login'; 
import adminRoutes from './admin';
import productReservationsRoutes from './productReservations';
import { verifyAdminToken } from './auth';
import alterTableRoutes from './alterTable';
const router = Router();

router.use('/login', loginRoute);
router.use('/admin', verifyAdminToken);
router.use('/users', usersRoutes);
router.use('/devices', devicesRoutes);
router.use('/admin/reservations', adminRoutes);
router.use('/reservations', reservationsRoutes);
router.use('/product-reservations', productReservationsRoutes);
router.use('/alter-table', alterTableRoutes);
router.use('/', categoryRoutes);

export default router;
