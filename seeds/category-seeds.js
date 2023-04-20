/*
 * Submitted
 * seeds/category-seeds.js
 * This script contains the seeds for the Category entity
 * Copyright 2022 Leo Wong
 */

import { Category } from '../models/index.js';

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

export default seedCategories;
