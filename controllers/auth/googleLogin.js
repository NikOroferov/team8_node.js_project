const { User } = require('../../models');
const { nanoid } = require('nanoid');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const { GOOGLE_SECRET_KEY, GOOGLE_CLIENT_ID } = process.env;

const googleUser = new OAuth2Client(GOOGLE_CLIENT_ID);

const googleLogin = (req, res) => {
  const { tokenId } = req.body;
  googleUser
    .verifyIdToken({
      idToken: tokenId,
      audience: GOOGLE_CLIENT_ID,
    })
    .then(res => {
      // eslint-disable-next-line camelcase
      const { email_verified, name, email } = res.payload;

      // eslint-disable-next-line camelcase
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          const verificationToken = nanoid();
          if (err) {
            return res.status(400).json({
              error: 'Sorry, an error occurred! Please try again ...',
            });
          } else {
            if (user) {
              const payload = {
                id: user._id,
              };
              const token = jwt.sign(payload, GOOGLE_SECRET_KEY, {
                expiresIn: '14d',
              });

              const { id, email, verificationToken } = user;

              User.findByIdAndUpdate(user.id, { token });

              res.json({
                user: { id, token, email, verificationToken },
              });
            } else {
              const password = email + GOOGLE_SECRET_KEY;

              const newUser = new User({
                name,
                email,
                password,
                verificationToken,
              });
              newUser.save((err, data) => {
                if (err) {
                  return res.status(400).json({
                    error: 'Sorry, an error occurred! Please try again...',
                  });
                }
                const payload = {
                  id: user._id,
                };
                const token = jwt.sign(payload, GOOGLE_SECRET_KEY, {
                  expiresIn: '14d',
                });

                const { id, email } = newUser;

                User.findByIdAndUpdate(data.id, { token });

                res.json({
                  status: 'succes',
                  code: 200,
                  data: {
                    token,
                    id,
                    email,
                    user: {
                      id: newUser._id,
                      avatarURL: newUser.avatarURL,
                      name: newUser.name,
                      email: newUser.email,
                      balance: newUser.balance,
                    },
                  },
                });
              });
            }
          }
        });
      }
    });
};

module.exports = googleLogin;
