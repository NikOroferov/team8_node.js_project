const { Unauthorized } = require('http-errors');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');

const { SECRET_KEY } = process.env;

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, verify: true });
  if (!user || !user.verify || user.comparePassword(password) == null) {
    console.log(user.comparePassword(password));
    throw new Unauthorized(
      `Email ${email} is wrong or not verify, or password is wrong`,
    );
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '14d' });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    status: 'succes',
    code: 200,
    data: {
      token,
      user: {
        id: user._id,
        avatarURL: user.avatarURL,
        name: user.name || user.email,
        email: user.email,
        balance: user.balance,
      },
    },
  });
};

module.exports = login;
