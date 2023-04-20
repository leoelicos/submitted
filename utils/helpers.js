/*
 * Submitted
 * utils/helpers.js
 * This script contains a function which formats a UNIX date into a string with weekday, year, month and day
 * Copyright 2022 Leo Wong
 */

export default {
  format_date: (date) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString(undefined, options);
  },
};
