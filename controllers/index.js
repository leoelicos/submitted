/*
 * Submitted
 * controllers/index.js
 * This script contains the necessary code to delegate the '/' routes and the '/api/' routes
 * Copyright 2022 Leo Wong
 */

import express from 'express';
import apiRoutes from './api/index.js';
import homeRoutes from './homeRoutes.js';

const router = express.Router();

router.use('/', homeRoutes);
router.use('/api', apiRoutes);

export default router;
