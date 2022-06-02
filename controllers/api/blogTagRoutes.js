/*
 * Tech Blog
 * controllers/api/blogTagRoutes.js
 * This script contains the necessary code to implement the /api/blogtag routes
 * Copyright 2022 Leo Wong
 */

// import express router
const router = require('express').Router();

// import model required in blogTag routes
const { BlogTag } = require('../../models');

// define HTTP Response Status Codes
const OK = 200;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

router.get('/', async (req, res) => {
  try {
    const blogTagData = await BlogTag.findAll({
      order: [['tag_id', 'ASC']],
    });
    res.status(OK).json(blogTagData);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blogTagData = await BlogTag.findByPk(req.params.id);
    res.status(OK).json(blogTagData);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new blogTag
  try {
    const blogTagData = await BlogTag.create(req.body);

    // if no product tags, just respond
    res.status(OK).json(blogTagData);
  } catch (err) {
    res.status(BAD_REQUEST).json(err);
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
      res
        .status(NOT_FOUND)
        .json({ message: 'No blogTags found with that id!' });
      return;
    }

    res.json(blogTagData);
  } catch (err) {
    res.status(BAD_REQUEST).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a blogTag by its `id` value
  try {
    const blogTagData = await BlogTag.destroy({
      where: { id: req.params.id },
    });

    if (!blogTagData) {
      res
        .status(NOT_FOUND)
        .json({ message: 'No blogTags found with that id!' });
      return;
    }

    res.status(OK).json(blogTagData);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).json(err);
  }
});

module.exports = router;
