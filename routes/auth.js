const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {secret, access_expiration, refresh_expiration} = require('../config').jwt;
const json_required = require('../middlewares/json_required');

const router = express.Router();

router.post("/", json_required({username: 'string', password: 'string'}));
router.post("/", async function (req, res, next) {
  const {username, password} = req.body;
  try {
    const user = await User.findOne({username: username, password: password});
    if (!user) {
      throw new Error('Could not find user');
    } else {
      const access = await generateToken(username, 'access');
      const refresh = await generateToken(username, 'refresh');
      if (!access || !refresh) {
        throw new Error('jwt error!');
      }
      res.json({
        access: access,
        refresh: refresh
      });
      next();
    }
  } catch (error) {
    res.status(401).json({message: error.message});
  }
});

async function generateToken(username, type) {
  try {
    return await jwt.sign(
      {username: username},
      secret,
      {
        expiresIn: type === 'access' ? access_expiration : refresh_expiration,
        subject: type
      }
    );
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = router;
