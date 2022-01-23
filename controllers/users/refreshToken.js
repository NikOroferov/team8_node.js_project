const { equalToken } = require('../../middlewares');

const refresh = async (req, res, next) => {
  const { refreshToken } = req.body;

  const newRefresh = await equalToken(refreshToken);

  if (newRefresh === null || undefined) {
    return res
      .status(400)
      .send({ message: 'Sorry, the token is not provided!' });
  }
  next();

  const { user, newToken } = newRefresh;

  res.status(200).json({
    message: 'success',
    data: {
      user,
      newToken,
    },
  });
};

module.exports = refresh;
