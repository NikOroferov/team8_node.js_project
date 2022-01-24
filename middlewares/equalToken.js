const { Unauthorized } = require('http-errors');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const { SECRET_KEY } = process.env;

const equalToken = async refreshToken => {
  try {
    if (!refreshToken) {
      return new Unauthorized('Oops... No refresh token!');
    }

    const refreshValidToken = token => {
      try {
        return jwt.verify(token, SECRET_KEY, {
          expiresIn: '14d',
        });
      } catch (error) {
        return null;
      }
    };
    const userToken = async refreshToken => {
      try {
        return await User.findOne({ refreshToken: refreshToken });
      } catch (error) {
        return error;
      }
    };

    if (!refreshValidToken || !userToken) {
      return new Unauthorized('Sorry, you are not an authorized user!');
    }

    const user = await User.findById(userToken._id);
    const payload = { _id: user.id };
    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn: '14d',
    });
    const newToken = token(user.email);

    const saveUserToken = async ({ _id: id }, refreshToken) => {
      return await User.findByIdAndUpdate(
        { id },
        {
          refreshToken,
        },
        { new: true },
      );
    };

    await saveUserToken(user._id, newToken.refreshToken);

    return { user, newToken };
  } catch (error) {
    return error;
  }
};

module.exports = equalToken;
