/*
 * Submitted
 * connection.js
 * This script contains the necessary code to initiate the connection to either JAWSDB, which is used on Heroku, or the default DB, which is used locally
 * Copyright 2022 Leo Wong
 */

// load .env file contents into process.env
require('dotenv').config();

// import Sequelize object
const Sequelize = require('sequelize');

// create new Sequelize object depending on whether Heroku is used
const sequelize = process.env.JAWSDB_URL
  ? // if Heroku is used
    new Sequelize(process.env.JAWSDB_URL)
  : // if not
    new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: 'localhost',
        dialect: 'mysql',
        dialectOptions: {
          decimalNumbers: true,
        },
      }
    );

module.exports = sequelize;
