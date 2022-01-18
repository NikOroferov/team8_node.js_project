const { NotFound } = require('http-errors');
const { Transaction } = require('../../models');

const getExpenseTransactions = async (req, res) => {
  const { _id } = req.user;

  const transactions = await Transaction.find({
    expenses: false,
    owner: _id,
  });

  if (!transactions) {
    throw new NotFound('There are no transactions');
  }

  sendSuccessResponse(res, { transactions });
};

module.exports = getExpenseTransactions;
