/*
 * Submitted
 * utils/auth.js
 * This script contains a custom middleware function which redirects a user to the login page if they are not logged in to the session
 * Copyright 2022 Leo Wong
 */

const withAuth = (req, res, next) => {
  // if user is not logged in, redirect to login page, otherwise go ahead
  if (!req.session.logged_in) {
    res.redirect('/login');
    return;
  }
  next();
};

module.exports = withAuth;
