const { User } = require('../../models');
const { Unauthorized } = require('http-errors');
const sha256 = require('sha256');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const { SENDGRID_API_KEY, SECRET_KEY, Email } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email, verify: true });
  if (!user) {
    throw new Unauthorized(`No user with email '${email}' found`);
  }
  const password = sha256(Date.now() + SECRET_KEY, {
    expiresIn: '1d',
  });
  user.password = password;

  await user.save();

  const sendEmail = {
    to: user.email,
    from: Email,
    subject: 'Your forgotten password from KapuSta!',
    text: `Please your temporary password from the KapuSta app: <b>${password}</b>`,
    html: `Please your temporary password from the KapuSta app: <b>${password}</b>`,
  };
  await sgMail.send(sendEmail);
  res.json({ status: 'succes' });
};

module.exports = forgotPasswordController;
