/*
 * Submitted
 * seeds/index.js
 * This script contains the necessary code to coordinate the seeds
 * Copyright 2022 Leo Wong
 */

const seedBlogs = require('./blog-seeds');
const seedBlogTags = require('./blog-tag-seeds');
const seedCategories = require('./category-seeds');
const seedComments = require('./comment-seeds');
const seedTags = require('./tag-seeds');
const seedUsers = require('./user-seeds');

const sequelize = require('../config/connection');

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
