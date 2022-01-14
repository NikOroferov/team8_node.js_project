const { User } = require('../../models');

const getCurrent = async (req, res) => {
  const { _id, avatarURL, email, balance } = req.user;
  await User.findById(_id);
  res.json({
    status: 'succes',
    code: 200,
    data: {
      user: { avatarURL, email, balance },
    },
  });
};

module.exports = getCurrent;
