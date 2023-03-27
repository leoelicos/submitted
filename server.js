/*
 * Tech Blog
 * server.js
 * This script contains the necessary code to initiate the application
 * Copyright 2022 Leo Wong
 */
const config = require('dotenv');
config();
// import utility for working with file and directory paths
const path = require('path');

// import server framework for Node.js
const express = require('express');

// import session middleware for Expresss
const session = require('express-session');

// import templating engine to keep view and controller separated
const exphbs = require('express-handlebars');

// import controller logic
const routes = require('./controllers');

// import ORM that facilitates MySQL relational database
const sequelize = require('./config/connection');

// import helper utilities
const helpers = require('./utils/helpers');

// import session store for connect-session using sequelize
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// assign variable app for readability
const app = express();

// use Heroku's env port for deployment, and local port 3001 for testing
const PORT = process.env.PORT || 3001;

// set up Handlebars.js engine with  helper utilities
const hbs = exphbs.create({ helpers });

// define session object
const sess = {
  // string to compute the hash
  secret: process.env.SESSION_SECRET,

  // cookie to last the session
  cookie: {
    maxAge: 86400000, // 86,400,000 = 1 day
  },

  // for every request to the server, don't reset the session cookie
  resave: false,

  // at the end of the request, session object will be stored in the session store
  saveUninitialized: true,

  // store session object in sequelize
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// function to start the application
const init = () => {
  // configure express

  // implement session
  app.use(session(sess));

  // assign handlebars as Express engine
  app.engine('handlebars', hbs.engine);

  // assign view engine as handlebars
  app.set('view engine', 'handlebars');

  // implement middleware that parses json
  app.use(express.json());

  // implement middleware that parses urlencoded bodies
  app.use(express.urlencoded({ extended: true }));

  // implement middleware that serves static files
  app.use(express.static(path.join(__dirname, 'public')));

  // implement middleware that serves custom routes
  app.use(routes);

  // implement server
  sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
  });
};

// start the application
init();
