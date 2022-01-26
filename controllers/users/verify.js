const { User } = require('../../models');

const verify = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: false,
  });
  res.json({
    message: `Email ${user.email} has been successfully confirmed`,
  });
};

module.exports = verify;
