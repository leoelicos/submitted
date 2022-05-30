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
    email: 'EllaCochran@hotmail.com',
    password: 'password12345',
  },
  {
    username: 'KathieHowell',
    email: 'KathieHowell@hotmail.com',
    password: 'password12345',
  },
  {
    username: 'KaraMora',
    email: 'KaraMora@hotmail.com',
    password: 'password12345',
  },
  {
    username: 'IngridRangel',
    email: 'IngridRangel@hotmail.com',
    password: 'password12345',
  },
  {
    username: 'TamikaHill',
    email: 'TamikaHill@hotmail.com',
    password: 'password12345',
  },
  {
    username: 'RosarioFreeman',
    email: 'RosarioFreeman@hotmail.com',
    password: 'password12345',
  },
  {
    username: 'HollyDavid',
    email: 'HollyDavid@hotmail.com',
    password: 'password12345',
  },
  {
    username: 'FaithSantiago',
    email: 'FaithSantiago@hotmail.com',
    password: 'password12345',
  },
  {
    username: 'CarmenHines',
    email: 'CarmenHines@hotmail.com',
    password: 'password12345',
  },
  {
    username: 'DawnNichols',
    email: 'DawnNichols@hotmail.com',
    password: 'password12345',
  },
  {
    username: 'AlissaBailey',
    email: 'AlissaBailey@hotmail.com',
    password: 'password12345',
  },
  {
    username: 'JennaBond',
    email: 'JennaBond@hotmail.com',
    password: 'password12345',
  },
  {
    username: 'MaribelBaird',
    email: 'MaribelBaird@hotmail.com',
    password: 'password12345',
  },
  {
    username: 'DeenaHolloway',
    email: 'DeenaHolloway@hotmail.com',
    password: 'password12345',
  },
  {
    username: 'KarinaBarajas',
    email: 'KarinaBarajas@hotmail.com',
    password: 'password12345',
  },
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;
