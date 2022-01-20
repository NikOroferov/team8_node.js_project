const { User } = require('../../models');

const logout = async (req, res) => {
  const { _id: id } = req.user;
  await User.findByIdAndUpdate(id, { token: null });
  res.json({
    code: 204,
    message: 'Logout success',
  });
};

module.exports = logout;
