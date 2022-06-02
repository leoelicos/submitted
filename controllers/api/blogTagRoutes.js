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
    res.status(200).json(blogTagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blogTagData = await BlogTag.findByPk(req.params.id);
    res.status(200).json(blogTagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new blogTag
  try {
    const blogTagData = await BlogTag.create(req.body);

    // if no product tags, just respond
    res.status(200).json(blogTagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a blogTag by its `id` value
  try {
    /* update BlogTag
     */
    const blogTagData = await BlogTag.update(req.body, {
      where: { id: req.params.id },
    });
    if (!blogTagData) {
      res.status(404).json({ message: 'No blogTags found with that id!' });
      return;
    }

    res.json(blogTagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a blogTag by its `id` value
  try {
    const blogTagData = await BlogTag.destroy({
      where: { id: req.params.id },
    });

    if (!blogTagData) {
      res.status(404).json({ message: 'No blogTags found with that id!' });
      return;
    }

    res.status(200).json(blogTagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
