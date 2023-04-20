/*
 * Submitted
 * controllers/api/commentRoutes.js
 * This script contains the necessary code to implement the /api/comment routes
 * Copyright 2022 Leo Wong
 */

import express from 'express';
import { Comment } from '../../models/index.js';

const router = express.Router();

// The `/api/comments` endpoint

router.get('/', async (req, res) => {
  // find all comments
  try {
    const commentData = await Comment.findAll();
    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get('/:id', async (req, res) => {
  // find one comment by its `id` value
  // be sure to include its associated blogs
  try {
    const commentData = await Comment.findByPk(req.params.id);
    if (!commentData) {
      res.status(404).json({ message: 'No comments found with that id!' });
      return;
    }
    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new comment
  try {
    const commentData = await Comment.create(req.body);

    // if no product tags, just respond
    res.status(200).json(commentData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a comment by its `id` value
  try {
    /* update Comment 
    { tagIds: [1, 2, 3, 4] }
    */
    const commentData = await Comment.update(req.body, {
      where: { id: req.params.id },
    });
    if (!commentData) {
      res.status(404).json({ message: 'No comments found with that id!' });
      return;
    }

    res.json(commentData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a comment by its `id` value
  try {
    const commentData = await Comment.destroy({
      where: { id: req.params.id },
    });

    if (!commentData) {
      res.status(404).json({ message: 'No comments found with that id!' });
      return;
    }

    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
