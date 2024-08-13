const express = require('express');
const User = require('../models/user');
const router = express.Router();

// 로그인 미들웨어
router.use(async (req, res, next) => {
  const user = await User.findOne({ where: { username: 'testuser' } });
  if (!user) {
    return res.status(401).send('User not found');
  }
  req.user = user;
  next();
});

module.exports = router;
