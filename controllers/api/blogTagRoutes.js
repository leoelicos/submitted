/*
 * Tech Blog
 * controllers/api/blogTagRoutes.js
 * This script contains the necessary code to implement the /api/blogtag routes
 * Copyright 2022 Leo Wong
 */

const router = require('express').Router();
const { BlogTag } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const blogTagData = await BlogTag.findAll({
      order: [['tag_id', 'ASC']],
    });
    console.log(JSON.stringify(blogTagData));
    res.status(200).json(blogTagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
