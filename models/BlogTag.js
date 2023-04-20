/*
 * SubmittedTag
 * models/Blog.js
 * This script contains the necessary code to define the BlogTag entity
 * Copyright 2022 Leo Wong
 */

import { Model, DataTypes } from 'sequelize';

import sequelize from '../config/connection.js';

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

export default BlogTag;
