/*
 * Tech Blog
 * seeds/user-seeds.js
 * This script contains the seeds for the User entity
 * Copyright 2022 Leo Wong
 */

const { User } = require('../models');

const userData = [
  {
    username: 'EllaCochran',
    password: 'password12345',
  },
  {
    username: 'KathieHowell',
    password: 'password12345',
  },
  {
    username: 'KaraMora',
    password: 'password12345',
  },
  {
    username: 'IngridRangel',
    password: 'password12345',
  },
  {
    username: 'TamikaHill',
    password: 'password12345',
  },
  {
    username: 'RosarioFreeman',
    password: 'password12345',
  },
  {
    username: 'HollyDavid',
    password: 'password12345',
  },
  {
    username: 'FaithSantiago',
    password: 'password12345',
  },
  {
    username: 'CarmenHines',
    password: 'password12345',
  },
  {
    username: 'DawnNichols',
    password: 'password12345',
  },
  {
    username: 'AlissaBailey',
    password: 'password12345',
  },
  {
    username: 'JennaBond',
    password: 'password12345',
  },
  {
    username: 'MaribelBaird',
    password: 'password12345',
  },
  {
    username: 'DeenaHolloway',
    password: 'password12345',
  },
  {
    username: 'KarinaBarajas',
    password: 'password12345',
  },
];

const seedUsers = () =>
  User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

module.exports = seedUsers;
