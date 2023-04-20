/*
 * Submitted
 * models/Category.js
 * This script contains the necessary code to define the Category entity
 * Copyright 2022 Leo Wong
 */

import { Model, DataTypes } from 'sequelize';

import sequelize from '../config/connection.js';

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'category',
  }
);

export default Category;
