/*
 * Tech Blog
 * logout.js
 * This script contains the necessary code to allow user to log out, or a new user to sign up
 * Adapted from BCS resources 2022
 */

const logout = async () => {
  const response = await fetch('/api/user/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.replace('/');
  } else {
    alert(response.statusText);
  }
};

document.querySelector('#logout').addEventListener('click', logout);
