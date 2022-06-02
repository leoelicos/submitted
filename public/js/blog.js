/*
 * Tech Blog
 * blog.js
 * This script contains the necessary code to allow a user to add a new comment to an existing blog post
 * Copyright 2022 Leo Wong
 */

const newCommentHandler = async (event) => {
  event.preventDefault();

  console.log('hello');

  const text = document.querySelector('#comment-text').value.trim();
  const userId = event.target.dataset.loggedInUserId; // wrong
  const blogId = document.location.href.split('/')[4].split('?')[0];

  if (text && userId && blogId) {
    const response = await fetch(`/api/comment`, {
      method: 'POST',
      body: JSON.stringify({
        text,
        user_id: userId,
        blog_id: blogId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace(document.location.href);
    } else {
      alert('Failed to create comment');
    }
  }
};

const init = async () => {
  // CREATE button to add a new Comment
  // event delegation to newCommentHandler
  document
    .getElementById('newComment')
    .addEventListener('submit', newCommentHandler);
};

init();
