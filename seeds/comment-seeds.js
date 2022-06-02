/*
 * Tech Blog
 * seeds/comment-seeds.js
 * This script contains the seeds for the Comment entity
 * Copyright 2022 Leo Wong
 */
const { Comment } = require('../models');

const commentData = [
  {
    text: 'Pretty good blog post',
    user_id: 1,
    blog_id: 2,
  },
  {
    text: 'Pretty good blog post',
    user_id: 2,
    blog_id: 3,
  },
  {
    text: 'Pretty good blog post',
    user_id: 3,
    blog_id: 4,
  },
  {
    text: 'Pretty good blog post',
    user_id: 4,
    blog_id: 5,
  },
  {
    text: 'Pretty good blog post',
    user_id: 5,
    blog_id: 6,
  },
  {
    text: 'Pretty good blog post',
    user_id: 6,
    blog_id: 7,
  },
  {
    text: 'Pretty good blog post',
    user_id: 7,
    blog_id: 8,
  },
  {
    text: 'Pretty good blog post',
    user_id: 8,
    blog_id: 9,
  },
  {
    text: 'Pretty good blog post',
    user_id: 9,
    blog_id: 10,
  },
  {
    text: 'Pretty good blog post',
    user_id: 10,
    blog_id: 11,
  },
  {
    text: 'Pretty good blog post',
    user_id: 11,
    blog_id: 12,
  },
  {
    text: 'Pretty good blog post',
    user_id: 12,
    blog_id: 13,
  },
  {
    text: 'Pretty good blog post',
    user_id: 13,
    blog_id: 14,
  },
  {
    text: 'Pretty good blog post',
    user_id: 14,
    blog_id: 15,
  },
  {
    text: 'Pretty good blog post',
    user_id: 15,
    blog_id: 1,
  },
];

const seedComments = () => Comment.bulkCreate(commentData);

module.exports = seedComments;
