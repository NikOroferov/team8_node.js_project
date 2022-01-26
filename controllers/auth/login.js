const { Unauthorized, BadRequest } = require('http-errors');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const bcrypt = require('bcrypt');

require('dotenv').config();

const { SECRET_KEY } = process.env;

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!password) {
      throw new BadRequest('Sorry, you need a password');
    }

    const user = await User.findOne({ email });
    if (!user || !user.verify) {
      throw new Unauthorized(
        `Email ${email} is wrong or not verify, or password is wrong`,
      );
    }

    if (!(await bcrypt.compareSync(password, user.password))) {
      throw new Unauthorized(`Wrong password`);
    }
    const payload = { id: user._id };

    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn: '14d',
    });

    await User.findByIdAndUpdate(user._id, { token });

    res.json({
      status: 'succes',
      code: 200,
      data: {
        token,
        user: {
          id: user._id,
          avatar: user.avatar,
          name: user.name,
          email: user.email,
          balance: user.balance,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = login;
