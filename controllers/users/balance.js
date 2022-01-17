const { User } = require('../../models');
const { NotFound } = require('http-errors');

const balance = async (req, res, next) => {
  try {
    const { _id } = req.user._id;
    const { balance } = req.body;
    const updateBalanceUser = await User.findByIdAndUpdate(
      _id,
      { balance },
      { new: true },
    );
    if (!updateBalanceUser) {
      throw new NotFound('User not found');
    }
    res.json({
      user: {
        email: updateBalanceUser.email,
        name: updateBalanceUser.name,
        balance: updateBalanceUser.balance,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = balance;
