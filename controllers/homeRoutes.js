/*
 * Tech Blog
 * controllers/homeRoutes.js
 * This script contains the necessary code to define the / routes
 * Copyright 2022 Leo Wong
 */

const router = require('express').Router();
const { Blog, BlogTag, Category, Comment, Tag, User } = require('../models');
const withAuth = require('../utils/auth');

const getBlogTags = async (blogId) =>
  BlogTag.findAll({
    where: { blog_id: blogId },
  });

const getComments = async (blogId) =>
  Comment.findAll({
    where: { blog_id: blogId },
    include: {
      model: User,
      attributes: ['username'],
    },
  });

const getTag = async (id) => Tag.findOne({ where: { id: id } });

router.get('/', async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Category,
          attributes: ['category_name'],
        },
      ],
    });

    const blogs = blogData.map((blog) => {
      return blog.get({ plain: true });
    });

    for (let i = 0; i < blogs.length; i++) {
      const blogTagsData = await getBlogTags(blogs[i].id);
      blogs[i].blogtags = [];
      for (let j = 0; j < blogTagsData.length; j++) {
        const blogTag = blogTagsData[j].get({ plain: true });
        // console.log(blogTag);

        const tagData = await getTag(blogTag.tag_id);
        const tag = tagData.get({ plain: true });
        blogs[i].blogtags.push(tag.tag_name);
      }
    }

    console.log('blogs = ', blogs);

    res.render('homepage', {
      blogs,

      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/blog/:id', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const loggedInUserData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blog }],
    });

    const loggedInUser = loggedInUserData.get({ plain: true });

    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Category,
          attributes: ['category_name'],
        },
      ],
    });

    const blog = blogData.get({ plain: true });

    const blogTagsData = await getBlogTags(blog.id);
    blog.blogtags = [];
    for (let j = 0; j < blogTagsData.length; j++) {
      const blogTag = blogTagsData[j].get({ plain: true });
      const tagData = await getTag(blogTag.tag_id);
      const tag = tagData.get({ plain: true });
      blog.blogtags.push(tag.tag_name);
    }

    // get comments
    const commentsData = await getComments(blog.id);

    console.log('commentData = ', commentsData);

    const comments = commentsData.map((commentData) =>
      commentData.get({ plain: true })
    );

    console.log('The comments are ', comments);

    res.render('blog', {
      ...blog,
      loggedInUser,
      comments,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blog }],
    });

    const user = userData.get({ plain: true });

    const blogData = await Blog.findAll({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Category,
          attributes: ['category_name'],
        },
      ],
    });

    const blogs = blogData.map((blog) => {
      return blog.get({ plain: true });
    });

    for (let i = 0; i < blogs.length; i++) {
      const blogTagsData = await getBlogTags(blogs[i].id);
      blogs[i].blogtags = [];
      for (let j = 0; j < blogTagsData.length; j++) {
        const blogTag = blogTagsData[j].get({ plain: true });

        const tagData = await getTag(blogTag.tag_id);
        const tag = tagData.get({ plain: true });
        blogs[i].blogtags.push(tag.tag_name);
      }
    }

    res.render('dashboard', {
      ...user,
      blogs,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

module.exports = router;
