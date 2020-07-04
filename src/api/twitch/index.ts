import * as express from 'express';

import followRoutes from './follows/follows';
import streamRoutes from './streams/streams';
import userRoutes from './users/users';
import viewsRoutes from './views/views';

const router = express.Router();

router.use('/', followRoutes);
router.use('/', streamRoutes);
router.use('/', userRoutes);
router.use('/', viewsRoutes);

export default router;
