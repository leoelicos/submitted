/*
 * Submitted
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

// Route handler to get all blog tags
router.get('/', async (req, res) => {
  try {
    // Sequelize API to find all blogtags
    const blogTagsData = await BlogTag.findAll({
      order: [['tag_id', 'ASC']],
    });

    // Serialize each iteration
    const blogTags = blogTagsData.map((blogTagData) =>
      blogTagData.get({ plain: true })
    );

    // Respond with blogTags and status OK
    res.status(OK).json(blogTags);

    // Respond with any error and status INTERNAL SERVER ERROR
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).json(err);
  }
});

// Route handler to get specific blogtag with id
router.get('/:id', async (req, res) => {
  try {
    // get param from req
    const blogTagId = req.params.id;

    // Sequelize API to find blogTag by primary key
    const blogTagData = await BlogTag.findByPk(blogTagId);

    // Serialize the blogData
    const blogTag = blogTagData.get({ plain: true });

    // Respond with blogTag and status OK
    res.status(OK).json(blogTag);

    // Respond with any error and status INTERNAL SERVER ERROR
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).json(err);
  }
});

// Route handler to add a blogtag
router.post('/', async (req, res) => {
  try {
    // Get parameters from req
    const body = req.body;

    // Sequelize API to create a blog
    const blogTagData = await BlogTag.create(body);

    // if no product tags, just respond
    res.status(OK).json(blogTagData);
  } catch (err) {
    res.status(BAD_REQUEST).json(err);
  }
});

// Route handler to edit a blogtag
router.put('/:id', async (req, res) => {
  try {
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

// Route handler to delete a blogtag by its id
router.delete('/:id', async (req, res) => {
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
