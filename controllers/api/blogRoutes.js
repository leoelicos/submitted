/*
 * Tech Blog
 * controllers/api/blogRoutes.js
 * This script contains the necessary code to define the '/api/blogRoutes' CRUD requests
 * Copyright 2022 Leo Wong
 */

const router = require('express').Router();
const { Blog, Comment, BlogTag } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newBlog = await Blog.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newBlog);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.update(req.body, {
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: 'No blog found with this id!' });
      return;
    }

    const databaseBlogTags = await BlogTag.findAll({
      where: { blog_id: req.params.id },
    });

    const databaseBlogTagIds = databaseBlogTags.map(({ tag_id }) => tag_id);

    let newBlogTags = [];
    if (req.body.tagIds) {
      newBlogTags = req.body.tagIds
        .filter((tag_id) => databaseBlogTagIds.includes(tag_id))
        .map((tag_id) => {
          return { blog_id: req.params.id, tag_id };
        });
    }

    let blogTagsToRemove = [];
    if (req.body.tagIds) {
      blogTagsToRemove = databaseBlogTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);
    }
    const updatedBlogTags = await Promise.all([
      BlogTag.destroy({ where: { id: blogTagsToRemove } }),
      BlogTag.bulkCreate(newBlogTags),
    ]);
    res.status(200).json(updatedBlogTags);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
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
      BlogTag.destroy({ where: { id: blogTagsToRemove } }),
      Comment.destroy({ where: { id: commentsToRemove } }),
    ]);

    res.status(200).json(updatedBlogTags);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
