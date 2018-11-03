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

module.exports = router;