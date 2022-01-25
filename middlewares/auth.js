const { Unautorized } = require('http-errors');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const { SECRET_KEY } = process.env;

const auth = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  if (!auth) {
    return next(new Unautorized('Not authorized'));
  }
  const [bearer, token] = authorization.split(' ');
  try {
    if (bearer !== 'Bearer') {
      throw new Unautorized('Not authorized');
    }
    const { id } = jwt.verify(token, SECRET_KEY, { expiresIn: '14d' });
    const user = await User.findById(id);
    if (!user || !user.token) {
      throw new Unautorized('Not authorized');
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.message === 'Invalid sugnature') {
      error.status = 401;
    }
    next(error);
  }
};

module.exports = auth;
