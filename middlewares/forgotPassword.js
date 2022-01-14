const sgMail = require('@sendgrid/mail');
const { User } = require('../models');
const { Unauthorized } = require('http-errors');
const sha256 = require('sha256');

const { Email } = process.env;

const forgotPassword = async email => {
  const user = await User.findOne({ email, verify: true });
  if (!user) {
    throw new Unauthorized(`No user with email '${email}' found`);
  }
  const password = sha256(Date.now() + process.env.SECRET_KEY);
  user.password = password;
  await user.save();

  const msg = {
    to: user.email,
    from: { Email },
    subject: 'Forgot password!',
    text: `Here is your temporary password: ${password}`,
    html: `Here is your temporary password: ${password}`,
  };
  await sgMail.send(msg);
};

module.exports = { forgotPassword };
