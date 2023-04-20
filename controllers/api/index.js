/*
 * Submitted
 * controllers/api/index.js
 * This script contains the necessary code to implement the /api/routes
 * Copyright 2022 Leo Wong
 */

import express from 'express';
import blogRoutes from './blogRoutes.js';
import blogTagRoutes from './blogTagRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import commentRoutes from './commentRoutes.js';
import tagRoutes from './tagRoutes.js';
import userRoutes from './userRoutes.js';

const router = express.Router();

router.use('/blog', blogRoutes);
router.use('/blogtag', blogTagRoutes);
router.use('/category', categoryRoutes);
router.use('/comment', commentRoutes);
router.use('/tag', tagRoutes);
router.use('/user', userRoutes);

export default router;
