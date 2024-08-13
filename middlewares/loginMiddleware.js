const User = require('../models/user');

const loginMiddleware = async (req, res, next) => {
  const user = await User.findOne({ where: { username: 'testuser' } });
  req.user = user || null;
  next();
};

module.exports = loginMiddleware;
