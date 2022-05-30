/*
 * Tech Blog
 * seeds/tag-seeds.js
 * This script contains the seeds for the Tag entity
 * Copyright 2022 Leo Wong
 */

const { Tag } = require('../models');

const tagData = [
  { tag_name: 'CSS' },
  { tag_name: 'Event Delegation' },
  { tag_name: 'Express.js' },
  { tag_name: 'fetch' },
  { tag_name: 'GitHub' },
  { tag_name: 'Handlebars.js' },
  { tag_name: 'Heroku' },
  { tag_name: 'HTML' },
  { tag_name: 'Javascript' },
  { tag_name: 'LinkedIn' },
  { tag_name: 'Local Storage' },
  { tag_name: 'Node.js' },
  { tag_name: 'OOP' },
  { tag_name: 'Sequelize' },
  { tag_name: 'SQL' },
  { tag_name: 'Third-Party APIs' },
];

const seedTags = () => Tag.bulkCreate(tagData);

module.exports = seedTags;
