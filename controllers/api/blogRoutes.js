/*
 * Submitted
 * blogRoutes.js
 * Defines '/api/blog' CRUD requests
 * Copyright 2022 Leo Wong
 */

// import express router
import express from 'express';

// import models required in blog routes
import { Blog, Comment, BlogTag } from '../../models/index.js';

// import custom middleware to redirect users if they are not logged in
import withAuth from '../../utils/auth.js';

const router = express.Router();

// define HTTP Response Status Codes
const OK = 200;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

// Route handler to get all blogs
router.get('/', async (req, res) => {
  try {
    // Sequelize API to find all blogs
    const blogsData = await Blog.findAll();

    // Serialize each iteration
    const blogs = blogsData.map((blogData) => blogData.get({ plain: true }));

    // Respond with blogs and status OK
    res.status(OK).json(blogs);

    // Respond with any error and status INTERNAL SERVER ERROR
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({ error });
  }
});

// Route handler to get specific blog with id
router.get('/:id', async (req, res) => {
  try {
    // get param from req
    const blogId = req.params.id;

    // Sequelize API to find blog by primary key
    const blogData = await Blog.findByPk(blogId);

    // Serialize the blogData
    const blog = blogData.get({ plain: true });

    // Respond with blog and status OK
    res.status(OK).json(blog);

    // Respond with any error and status INTERNAL SERVER ERROR
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({ error });
  }
});

// Route handler to add a blog
router.post('/', withAuth, async (req, res) => {
  try {
    // Get parameters from req
    const body = req.body;
    const userId = req.session.user_id;

    // Sequelize API to create a blog
    const blog = await Blog.create({ ...body, user_id: userId });

    // Respond with blog and status OK
    res.status(OK).json(blog);

    // Respond with any error and status INTERNAL SERVER ERROR
  } catch (error) {
    res.status(BAD_REQUEST).json(error);
  }
});

// Route handler to edit a blog
router.put('/:id', withAuth, async (req, res) => {
  try {
    // Get parameters from req
    const body = req.body;
    const blogId = req.params.id;
    const tagIds = req.body.tagIds;

    // Sequelize API to update a blog
    const blogData = await Blog.update(body, { where: { id: blogId } });

    // If the blog doesn't exist, respond with message and status NOT FOUND
    if (!blogData) {
      res.status(NOT_FOUND).json({ message: 'No blog found with this id!' });
      return;
    }

    // If there are no tagIds, return blogData with status OK
    if (!tagIds) {
      res.status(OK).json(blogData);
      return;
    }

    /* 
      Create blog tags in tagIds[] but not in database
      Remove blog tags not in tagIds[] from database 
    */

    // Sequelize API to get all blog tags
    const databaseBlogTags = await BlogTag.findAll({
      where: { blog_id: blogId },
    });

    // Extract tag ids
    const databaseBlogTagIds = databaseBlogTags.map(({ tag_id }) => tag_id);

    // array for created blog tags
    let newBlogTags = tagIds
      .filter((tag_id) => databaseBlogTagIds.includes(tag_id))
      .map((tag_id) => {
        return { blog_id: blogId, tag_id };
      });

    let blogTagsToRemove = databaseBlogTags
      .filter(({ tag_id }) => !tagIds.includes(tag_id))
      .map(({ id }) => id);

    const updatedBlogTags = await Promise.all([
      BlogTag.destroy({ where: { id: blogTagsToRemove } }),
      BlogTag.bulkCreate(newBlogTags),
    ]);
    res.status(200).json(updatedBlogTags);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route handler to delete a blog by its id
router.delete('/:id', withAuth, async (req, res) => {
  try {
    // check if blog with this id exists
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      res.status(404).json({ message: 'No blog found with this id!' });
      return;
    }

    const databaseBlogTags = await BlogTag.findAll({
      where: { blog_id: req.params.id },
    });

    const blogTagsToRemove = databaseBlogTags.map(({ tag_id }) => tag_id);

    const databaseComments = await Comment.findAll({
      where: { blog_id: req.params.id },
    });

    const commentsToRemove = databaseComments.map(({ blog_id }) => blog_id);

    const updatedBlogTags = await Promise.all([
      Blog.destroy({ where: { id: req.params.id } }),
      BlogTag.destroy({ where: { id: blogTagsToRemove } }),
      Comment.destroy({ where: { id: commentsToRemove } }),
    ]);

    res.status(200).json(updatedBlogTags);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
