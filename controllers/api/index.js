/*
 * Submitted
 * controllers/api/index.js
 * This script contains the necessary code to implement the /api/routes
 * Copyright 2022 Leo Wong
 */

const router = require('express').Router();
const blogRoutes = require('./blogRoutes');
const blogTagRoutes = require('./blogTagRoutes');
const categoryRoutes = require('./categoryRoutes');
const commentRoutes = require('./commentRoutes');
const tagRoutes = require('./tagRoutes');
const userRoutes = require('./userRoutes');

router.use('/blog', blogRoutes);
router.use('/blogtag', blogTagRoutes);
router.use('/category', categoryRoutes);
router.use('/comment', commentRoutes);
router.use('/tag', tagRoutes);
router.use('/user', userRoutes);

module.exports = router;
