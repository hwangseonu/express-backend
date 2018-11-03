const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const authMiddleware = require('../middlewares/auth');
const jsonMiddleware = require('../middlewares/json');

router.post('/', authMiddleware('access'));
router.post('/', jsonMiddleware({title: 'string', content: 'string'}));
router.post('/', (req, res) => {
  const { title, content } = req.body;
  const post = new Post({
    writer: req.user,
    title: title,
    content: content
  });
  post.save()
    .then(() => {
      res.status(201).json({message: 'Create post successfully!'})
    })
    .catch(error => {
      res.status(500).json({message: error.message})
    })
});

router.post('/:pid/comments', authMiddleware('access'));
router.post('/:pid/comments', jsonMiddleware({content: 'string'}));
router.post('/:pid/comments', (req, res) => {
  const { content } = req.body;
  Post.findOne({_id: req.params.pid})
    .then(post => {
      if (!post) {
        throw new Error('Could not find post')
      } else {
        post.comments.push({
          writer: req.user._id,
          content: content
        });
        post.save()
      }
    })
    .then(() => {
      res.status(201).end()
    })
    .catch(error => {
      res.status(404).json({message: error.message})
    });
});

module.exports = router;