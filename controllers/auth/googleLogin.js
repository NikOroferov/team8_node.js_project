const { User } = require('../../models');
const { nanoid } = require('nanoid');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const { SECRET_KEY, GOOGLE_CLIENT_ID } = process.env;

const googleUser = new OAuth2Client(GOOGLE_CLIENT_ID);

const googleLogin = (req, res) => {
  const { tokenId } = req.body;
  googleUser
    .verifyIdToken({
      idToken: tokenId,
      audience: GOOGLE_CLIENT_ID,
    })
    .then(response => {
      const { verify, name, email } = response.payload;

      if (verify) {
        User.findOne({ email }).exec((err, user) => {
          const verifyToken = nanoid();
          if (err) {
            return res.status(400).json({ error: 'Something went wrong....' });
          } else {
            if (user) {
              const payload = {
                id: user._id,
              };
              const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '14d' });

              const { id, email, verifyToken } = user;

              User.findByIdAndUpdate(user.id, { token });

              res.json({
                user: { id, token, email, verifyToken },
              });
            } else {
              const password = email + SECRET_KEY;

              const newUser = new User({
                name,
                email,
                password,
                verifyToken,
              });
              newUser.save((err, data) => {
                if (err) {
                  return res
                    .status(400)
                    .json({ error: 'Something went wrong....' });
                }
                const payload = {
                  id: user._id,
                };
                const token = jwt.sign(payload, SECRET_KEY, {
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
