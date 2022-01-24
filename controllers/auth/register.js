const { Conflict } = require('http-errors');
const gravatar = require('gravatar');
const { sendEmail } = require('../../helpers');
const { User } = require('../../models');
const sha256 = require('sha256');

const { BASE_URL, SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    res
      .status(409)
      .json(
        new Conflict(
          `${email} in use! Please verify the email you provided when registering`,
        ),
      );
  }
  const avatar = gravatar.url(email);
  const verificationToken = sha256(Date.now() + SECRET_KEY);
  const newUser = new User({
    ...req.body,
    name,
    verificationToken,
    avatar,
  });
  newUser.setPassword(password);
  await newUser.save();

  const mail = {
    to: email,
    subject: 'Email confirmation',
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Welcome to our KapuSta app! To continue working, please confirm your registration <b>${email}</b></a>`,
  };
  await sendEmail(mail);

  res.status(201).json({
    status: 'succes',
    code: 201,
    data: {
      name: newUser.name || newUser.email,
      avatar: newUser.avatar,
      email: newUser.email,
      verificationToken: newUser.verificationToken,
    },
  });
};

module.exports = register;
