/*
 * Submitted
 * seeds/blog-tag-seeds.js
 * This script contains the seeds for the Blog Tag entity
 * Copyright 2022 Leo Wong
 */

import { BlogTag } from '../models/index.js';

const blogTagData = [
  { blog_id: 1, tag_id: 3 },
  { blog_id: 1, tag_id: 6 },
  { blog_id: 2, tag_id: 3 },
  { blog_id: 2, tag_id: 6 },
  { blog_id: 3, tag_id: 3 },
  { blog_id: 3, tag_id: 14 },
  { blog_id: 4, tag_id: 3 },
  { blog_id: 4, tag_id: 15 },
  { blog_id: 5, tag_id: 3 },
  { blog_id: 5, tag_id: 7 },
  { blog_id: 6, tag_id: 13 },
  { blog_id: 7, tag_id: 12 },
  { blog_id: 8, tag_id: 16 },
  { blog_id: 9, tag_id: 5 },
  { blog_id: 9, tag_id: 10 },
  { blog_id: 10, tag_id: 4 },
  { blog_id: 11, tag_id: 2 },
  { blog_id: 12, tag_id: 11 },
  { blog_id: 13, tag_id: 9 },
  { blog_id: 14, tag_id: 1 },
  { blog_id: 15, tag_id: 8 },
];

const seedBlogTags = () => BlogTag.bulkCreate(blogTagData);

export default seedBlogTags;
