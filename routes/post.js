const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const authMiddleware = require('../middlewares/auth');
const jsonMiddleware = require('../middlewares/json');

router.post('/', authMiddleware('access'));
router.post('/', jsonMiddleware({title: 'string', content: 'string'}));
router.post('/', (req, res) => {
  const { title, content } = req.body;
  Post.create(req.user, title, content)
    .then(() => {
      res.status(201).end()
    })
    .catch((error) => {
      res.status(500).json({message: error.message})
    })
});

router.get('/', (req, res) => {
  Post.find()
    .populate({path: 'author', model: 'User'})
    .then((posts) => {
      return all_posts(posts)
    })
    .then(promises => {
      Promise.all(promises).then((values) => {
        res.json(values)
      })
    })
});

router.get('/:pid', (req, res) => {
  Post.findOne({_id: req.params.pid})
    .then(post => {
      if (!post) {
        throw new Error('Could not find post')
      } else {
        Promise.all(getComments(post.comments))
          .then(comments => {
            res.json({
              title: post.title,
              author: post.author.nickname,
              content: post.content,
              comments: comments
            })
          })
          .catch(error => res.status(404).json({message: error.message}))
      }
    })
    .catch(error => {
      res.status(404).json({message: error.message})
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
          author: req.user,
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

const all_comments = function (comments) {
  return comments.map((comment) => {
    return new Promise((resolve, reject) => {
      User.findOne({_id: comment.author})
        .then((user) => {
          resolve({
            comment_id: comment._id,
            author: user ? user.nickname : '탈퇴한 사용자',
            content: comment.content,
            createAt: comment.createAt,
            updateAt: comment.updateAt
          })
        })
        .catch((error) => {
          reject(error)
        })
    })
  })
};

const all_posts = function (posts) {
  return posts.map((post) => {
    return new Promise((resolve, reject) => {
      Promise.all(all_comments(post.comments))
        .then(comments => {
          resolve(post_response(post, comments))
        })
        .catch((error) => {
          reject(error)
        })
    })
  })
};

const post_response = function (post, comments) {
  return {
    post_id: post._id,
    author: post.author ? post.author.nickname : '탈퇴한 사용자',
    title: post.title,
    content: post.content,
    createAt: post.createAt,
    updateAt: post.updateAt,
    comments: comments
  }
};

module.exports = router;