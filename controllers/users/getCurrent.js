const { User } = require('../../models');
const { Unauthorized } = require('http-errors');

const getCurrent = async (req, res) => {
  const token = req.user.token;
  const user = await User.findOne({ token });
  if (!user) {
    throw new Unauthorized('Not authorized');
  }
  res.status(200).json({
    user: {
      avatarURL: user.avatarURL,
      name: user.name,
      email: user.email,
      balance: user.balance,
    },
  });
};

module.exports = getCurrent;
