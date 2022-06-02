/*
 * Tech Blog
 * dashboard.js
 * This script contains the necessary code to allow a user to add a new blog, edit an existing blog they own, or delete an existing blog they own
 * Copyright 2022 Leo Wong
 */

const newBlogHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector('#blog-title').value.trim();
  const summary = document.querySelector('#blog-summary').value.trim();
  const text = document.querySelector('#blog-text').value.trim();

  const id = event.target.dataset.user;
  console.log(`title = `, title);
  console.log(`summary = `, summary);
  console.log(`text = `, text);
  console.log(`id = `, id);

  if (title && summary && text && id) {
    const response = await fetch(`/api/blog`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        summary,
        text,
        user_id: id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to create blog');
    }
  }
};

const editBlogHandler = async (event) => {
  event.preventDefault();

  // get blog id
  const blogId = event.target.dataset.id;

  // create a new wrapper for the form
  const formContainer = document.createElement('section');
  formContainer.classList.add('login-container', 'edit');

  // create a new form
  const editFormEl = document.createElement('form');
  editFormEl.setAttribute('id', 'edit-form');
  editFormEl.setAttribute('data-id', blogId);
  editFormEl.classList.add('edit-blog-form');

  // fieldset for title
  const titleFieldset = document.createElement('fieldset');
  const titleLabel = document.createElement('label');
  titleLabel.innerText = 'Title:';
  titleLabel.setAttribute('for', 'editTitle');
  titleLabel.classList.add('login-label');
  titleFieldset.appendChild(titleLabel);
  const titleInput = document.createElement('input');
  titleInput.setAttribute('id', 'editTitle');
  titleInput.setAttribute('type', 'text');
  titleInput.classList.add('edit-blog-title');
  titleInput.value =
    event.target.parentNode.querySelector('.blog-title').innerText;
  titleFieldset.appendChild(titleInput);
  editFormEl.appendChild(titleFieldset);

  // fieldset for summary
  const summaryFieldset = document.createElement('fieldset');
  const summaryLabel = document.createElement('label');
  summaryLabel.innerText = 'Summary:';
  summaryLabel.setAttribute('for', 'editSummary');
  summaryLabel.classList.add('login-label');

  summaryFieldset.appendChild(summaryLabel);
  const summaryTextarea = document.createElement('textarea');
  summaryTextarea.setAttribute('id', 'editSummary');
  summaryTextarea.setAttribute('type', 'text');
  summaryTextarea.classList.add('edit-blog-summary');
  summaryTextarea.value =
    event.target.parentNode.querySelector('.blog-summary').innerText;
  summaryFieldset.appendChild(summaryTextarea);
  editFormEl.appendChild(summaryFieldset);

  // fieldset for text
  const textFieldset = document.createElement('fieldset');
  const textLabel = document.createElement('label');
  textLabel.innerText = 'Text:';
  textLabel.setAttribute('for', 'editText');
  textLabel.classList.add('login-label');
  textFieldset.appendChild(textLabel);
  const textTextarea = document.createElement('textarea');
  textTextarea.setAttribute('id', 'editText');
  textTextarea.setAttribute('type', 'text');
  textTextarea.value =
    event.target.parentNode.querySelector('.blog-text').innerText;
  textTextarea.classList.add('edit-blog-text');
  textFieldset.appendChild(textTextarea);
  editFormEl.appendChild(textFieldset);

  // button for save
  const submitButton = document.createElement('button');
  submitButton.setAttribute('type', 'submit');
  submitButton.classList.add('login-button');
  submitButton.innerText = 'SAVE EDIT';
  editFormEl.appendChild(submitButton);

  // add form to form container
  formContainer.appendChild(editFormEl);

  // insert form container before delete button
  const parentEl = event.target.parentNode;
  const deleteButtonEl = event.target.parentNode.children[7];
  parentEl.insertBefore(formContainer, deleteButtonEl);

  // add event listener to form for save button
  editFormEl.addEventListener('submit', (e) => editBlogFetch(blogId, e));
};

async function editBlogFetch(blogId, event) {
  event.preventDefault();
  title = event.target.children[0].children[1].value;
  summary = event.target.children[1].children[1].value;
  text = event.target.children[2].children[1].value;
  console.log(
    `blogId = ${blogId}, title = ${title}, summary = ${summary}, text = ${text}`
  );
  const response = await fetch(`/api/blog/${blogId}`, {
    method: 'PUT',
    body: JSON.stringify({
      title,
      summary,
      text,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    alert('Failed to edit blog');
  }
}

const deleteBlogHandler = async (event) => {
  event.preventDefault();
  const blogId = event.target.parentNode.dataset.id;

  const response = await fetch(`/api/blog/${blogId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    alert('Failed to delete blog');
  }
};

const init = async () => {
  // CREATE button to add a new Blog
  // event delegation to newBlogHandler
  document.getElementById('newBlog').addEventListener('submit', newBlogHandler);

  // EDIT buttons for rendered blogs
  // event delegation to editBlogHandler
  document.querySelectorAll('.edit-button').forEach((el) => {
    el.addEventListener('click', editBlogHandler);
  });

  // DELETE buttons for rendered blogs
  // event delegation to deleteBlogHandler
  document.querySelectorAll('.delete-button').forEach((el) => {
    el.addEventListener('click', deleteBlogHandler);
  });
};

init();
