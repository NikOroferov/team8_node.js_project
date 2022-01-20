const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const { SENDGRID_API_KEY, Email } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async data => {
  const email = { ...data, from: Email };
  try {
    await sgMail.send(email);
    return true;
  } catch (error) {
    throw error(error.message);
  }
};

module.exports = sendEmail;
