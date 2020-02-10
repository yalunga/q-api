import * as express from 'express';

import followRoutes from './follows';
import streamRoutes from './streams/streams';

const router = express.Router();

router.use('/', followRoutes);
router.use('/', streamRoutes);

export default router;
