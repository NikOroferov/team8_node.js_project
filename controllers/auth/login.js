const { Unauthorized, BadRequest } = require('http-errors');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { User } = require('../../models');

require('dotenv').config();

const { SECRET_KEY, GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID } = process.env;

const login = async (req, res, next) => {
  try {
    const { name, email, password, tokenId } = req.body;

    if (!password && !tokenId) {
      throw new BadRequest('Sorry, you need a password or token ID');
    }

    let user = await User.findOne({ email, verify: true });

    if (
      (!user || !user.verify || user.comparePassword(password) == null) &&
      !tokenId
    ) {
      throw new Unauthorized(`Email ${email} or password is wrong`);
    }

    if (tokenId) {
      const client = new OAuth2Client(GOOGLE_CLIENT_ID);
      const ticket = await client
        .verifyIdToken({
          idToken: tokenId,
          audience: GOOGLE_CLIENT_ID,
        })
        .catch(() => {
          throw new Unauthorized('Invalid token');
        });

      const { name: googleName } = ticket.getPayload();

      if (!user && ticket) {
        user = await User.create({
          email,
          name: googleName,
        });
      }
    }

    const { _id: id, balance } = user;
    const payload = { id };

    const token = jwt.sign(payload, GOOGLE_CLIENT_SECRET || SECRET_KEY, {
      expiresIn: '14d',
    });

    await User.findByIdAndUpdate(
      id,
      { token },
      {
        new: true,
        select: 'token',
      },
    );

    res.json({
      status: 'succes',
      code: 200,
      data: {
        token,
        user: {
          id: id,
          avatarURL: user.avatarURL,
          name: name || email,
          email: email,
          balance: balance,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = login;
