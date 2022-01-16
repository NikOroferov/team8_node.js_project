const { User } = require('../../models');

const getCurrent = async (req, res) => {
  const { _id, avatarURL, email } = req.user;
  await User.findById(_id);
  res.json({
    status: 'succes',
    code: 200,
    data: {
      user: { avatarURL, email },
    },
  });
};

module.exports = getCurrent;
