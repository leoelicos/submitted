/*
 * Submitted
 * models/index.js
 * This script contains the necessary code to define the relational database for techblog_db
 * Copyright 2022 Leo Wong
 */

import User from './User.js';
import Blog from './Blog.js';
import Comment from './Comment.js';
import Tag from './Tag.js';
import Category from './Category.js';
import BlogTag from './BlogTag.js';

User.hasMany(Blog, {
  foreignKey: 'user_id',
});

Blog.belongsTo(User, {
  foreignKey: 'user_id',
});

Blog.belongsTo(Category, {
  foreignKey: 'category_id',
});

Category.hasMany(Blog, {
  foreignKey: 'category_id',
});

Blog.belongsToMany(Tag, {
  through: BlogTag,
  foreignKey: 'blog_id',
});

Tag.belongsToMany(Blog, {
  through: BlogTag,
  foreignKey: 'tag_id',
});

User.hasMany(Comment, {
  foreignKey: 'user_id',
});

Comment.belongsTo(User, {
  foreignKey: 'user_id',
});

export { User, Blog, Comment, Tag, Category, BlogTag };
