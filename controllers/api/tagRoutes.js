/*
 * Submitted
 * controllers/api/tagRoutes.js
 * This script contains the necessary code to implement the /api/tag routes
 * Copyright 2022 Leo Wong
 */

const router = require('express').Router();
const { Tag, Blog, BlogTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Blog data
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Blog }],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Blog data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Blog }],
    });
    if (!tagData) {
      res.status(404).json({ message: 'No tags found with that id!' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  /* req.body should look like this...
    {
      tag_name: "Basketball",
      blogIds: [2, 3, 4]
    }
  */
  try {
    const tag = await Tag.create(req.body);

    // if there's blog tags, we need to create pairings to bulk create in the BlogTag model
    if (req.body.blogIds.length) {
      /* array of pairings 
        [
          {blog_id: 1, tag_id: 1},
          {blog_id: 2, tag_id: 1},
          {blog_id: 3, tag_id: 1},
          {blog_id: 4, tag_id: 1},
        ]
        */
      const blogTagIdArr = await req.body.blogIds.map((blog_id) => {
        return {
          tag_id: tag.id,
          blog_id,
        };
      });
      const blogTagIds = await BlogTag.bulkCreate(blogTagIdArr);
      res.status(200).json(blogTagIds);
      return;
    }

    // if no blog tags, just respond
    res.status(200).json(tag);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  // e.g. /api/tags/1
  try {
    await Tag.update(req.body, { where: { id: req.params.id } });

    const databaseBlogTags = await BlogTag.findAll({
      where: { tag_id: req.params.id },
    });

    const databaseBlogTagIds = databaseBlogTags.map(({ blog_id }) => blog_id);

    const newBlogTags = req.body.blogIds
      .filter((blog_id) => !databaseBlogTagIds.includes(blog_id))
      .map((blog_id) => {
        return { tag_id: req.params.id, blog_id };
      });

    const blogTagsToRemove = databaseBlogTags
      .filter(({ blog_id }) => !req.body.blogIds.includes(blog_id))
      .map(({ id }) => id);

    const updatedBlogTags = await Promise.all([
      BlogTag.destroy({ where: { id: blogTagsToRemove } }),
      BlogTag.bulkCreate(newBlogTags),
    ]);

    res.json(updatedBlogTags);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete one tag by its `id` value
  try {
    const tagData = await Tag.destroy({ where: { id: req.params.id } });

    if (!tagData) {
      res.status(404).json({ message: 'No tags found with that id!' });
      return;
    }

    const databaseBlogTags = await BlogTag.findAll({
      where: { tag_id: req.params.id },
    });

    const blogTagsToRemove = databaseBlogTags.map(({ blog_id }) => blog_id);

    const updatedBlogTags = await BlogTag.destroy({
      where: { id: blogTagsToRemove },
    });

    res.status(200).json(updatedBlogTags);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
