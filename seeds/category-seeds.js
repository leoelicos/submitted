/*
 * Tech Blog
 * seeds/category-seeds.js
 * This script contains the seeds for the Category entity
 * Copyright 2022 Leo Wong
 */

const { Category } = require('../models');

const categoryData = [
  {
    category_name: 'Homework',
  },
  {
    category_name: 'Challenges',
  },
  {
    category_name: 'Projects',
  },
  {
    category_name: 'Mini-projects',
  },
];

const seedCategories = () => Category.bulkCreate(categoryData);

module.exports = seedCategories;
