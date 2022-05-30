/*
 * Tech Blog
 * models/index.js
 * This script contains the necessary code to define the relational database for techblog_db
 * Copyright 2022 Leo Wong
 */

const User = require('./User');
const Blog = require('./Blog');
const Comment = require('./Comment');
const Tag = require('./Tag');
const Category = require('./Category');
const BlogTag = require('./BlogTag');

User.hasMany(Blog, {
  foreignKey: 'user_id',
});

Blog.belongsTo(User, {
  foreignKey: 'user_id',
});

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

module.exports = { User, Blog, Comment, Tag, Category, BlogTag };
