/*
 * Submitted
 * models/Comment.js
 * This script contains the necessary code to define the Comment entity
 * Copyright 2022 Leo Wong
 */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date_created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    blog_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'blog',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment',
  }
);

module.exports = Comment;
