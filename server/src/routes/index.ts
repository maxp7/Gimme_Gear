import { Router } from 'express';
import usersRoutes from './users';
import reservationsRoutes from './reservations';
import devicesRoutes from './devices';
import categoryRoutes from './categories';

const router = Router();

router.use('/reservations', reservationsRoutes);
router.use('/addUsers', usersRoutes);
router.use('/dbui', devicesRoutes);
router.use('/', categoryRoutes); 

export default router;
