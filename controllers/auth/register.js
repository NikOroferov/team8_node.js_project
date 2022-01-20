const { Conflict } = require('http-errors');
const gravatar = require('gravatar');
const { sendEmail } = require('../../helpers');
const { User } = require('../../models');
const sha256 = require('sha256');

const { PORT } = process.env;

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict(`${email} in use`);
  }
  const avatarURL = gravatar.url(email);
  const verificationToken = sha256(Date.now() + process.env.SECRET_KEY, {
    expiresIn: '1d',
  });
  const newUser = new User({
    ...req.body,
    name,
    verificationToken,
    avatarURL,
  });
  newUser.setPassword(password);
  await newUser.save();

  const mail = {
    to: email,
    subject: 'Email confirmation',
    html: `<a target="_blank" href="http://localhost:${PORT}/api/users/verify/${verificationToken}">Welcome to our KapuSta app! To continue working, please confirm your registration <b>${email}</b></a>`,
  };
  await sendEmail(mail);

  res.status(201).json({
    status: 'succes',
    code: 201,
    data: {
      name: newUser.name || newUser.email,
      avatarURL: newUser.avatarURL,
      email: newUser.email,
      verificationToken: newUser.verificationToken,
    },
  });
};

module.exports = register;
