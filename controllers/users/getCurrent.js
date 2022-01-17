const { User } = require('../../models');
const { Unauthorized } = require('http-errors');

// const getCurrent = async (req, res) => {
//   const { _id, avatarURL, email, name, balance } = req.user;
//   const user = await User.findById(_id);
//   if (!user) {
//     throw new Unauthorized('Not authorized');
//   }
//   res.json({
//     status: 'succes',
//     code: 200,
//     data: {
//       user: { avatarURL, email, name, balance },
//     },
//   });
// };

const getCurrent = async (req, res) => {
  const token = req.user.token;
  const user = await User.findOne({ token });
  if (!user) {
    throw new Unauthorized('Not authorized');
  }
  res.status(200).json({
    user: {
      email: user.email,
      name: user.name,
      balance: user.balance,
    },
  });
};

module.exports = getCurrent;
