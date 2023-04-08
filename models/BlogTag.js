/*
 * SubmittedTag
 * models/Blog.js
 * This script contains the necessary code to define the BlogTag entity
 * Copyright 2022 Leo Wong
 */

const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class BlogTag extends Model {}

BlogTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    blog_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'blog',
        key: 'id',
      },
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tag',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'blog_tag',
  }
);

module.exports = BlogTag;
