const { User } = require('../models');
const { sendEmail } = require('../helpers');
const { Unauthorized } = require('http-errors');
const sha256 = require('sha256');

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email, verify: true });
  if (!user) {
    throw new Unauthorized(`No user with email '${email}' found`);
  }

  const password = sha256(Date.now() + process.env.SECRET_KEY);
  user.password = password;

  await user.save();

  const mail = {
    to: user.email,
    from: email,
    subject: 'Forgot password!',
    text: `Here is your temporary password: ${password}`,
    html: `Here is your temporary password: ${password}`,
  };
  await sendEmail.send(mail);
};

module.exports = { forgotPassword };
