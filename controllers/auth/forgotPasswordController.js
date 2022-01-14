const { forgotPassword } = require('../../middlewares');

const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  await forgotPassword(email);
  res.json({ status: 'succes' });
};

module.exports = forgotPasswordController;
