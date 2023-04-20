/*
 * Submitted
 * seeds/index.js
 * This script contains the necessary code to coordinate the seeds
 * Copyright 2022 Leo Wong
 */

import seedBlogs from './blog-seeds.js';
import seedBlogTags from './blog-tag-seeds.js';
import seedCategories from './category-seeds.js';
import seedComments from './comment-seeds.js';
import seedTags from './tag-seeds.js';
import seedUsers from './user-seeds.js';

import sequelize from '../config/connection.js';

const seedAll = async () => {
  // sync database
  await sequelize.sync({ force: true });

  // seed categories
  await seedCategories();

  // seed tags
  await seedTags();

  // seed users
  await seedUsers();

  // blogs require users and categories
  await seedBlogs();

  // comments require blogs and users
  await seedComments();

  // blog tags require blogs and tags
  await seedBlogTags();

  process.exit(0);
};

seedAll();
