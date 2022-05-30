/*
 * Tech Blog
 * controllers/api/categoryRoutes.js
 * This script contains the necessary code to implement the /api/category routes
 * Copyright 2022 Leo Wong
 */

const router = require('express').Router();
const { Category, Blog } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // include its associated blogs
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Blog }],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated blogs
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Blog }],
    });
    if (!categoryData) {
      res.status(404).json({ message: 'No categories found with that id!' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const categoryData = await Category.create(req.body);

    // if no product tags, just respond
    res.status(200).json(categoryData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    /* update Category 
    { tagIds: [1, 2, 3, 4] }
    */
    const categoryData = await Category.update(req.body, {
      where: { id: req.params.id },
    });
    if (!categoryData) {
      res.status(404).json({ message: 'No categories found with that id!' });
      return;
    }

    res.json(categoryData);
  } catch (err) {
    // console.log(err);
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.destroy({
      where: { id: req.params.id },
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No categories found with that id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
