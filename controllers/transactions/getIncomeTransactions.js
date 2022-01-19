const { NotFound } = require('http-errors');
const { Transaction } = require('../../models');

const getIncomeTransactions = async (req, res) => {
  const { _id } = req.user;

  const transactions = await Transaction.find({
    expenses: true,
    owner: _id,
  });

  if (!transactions) {
    throw new NotFound('There are no transactions');
  }

  res.status(201).json({
    status: 'succes',
    code: 201,
    data: {
      transactions,
    },
  });
};

module.exports = getIncomeTransactions;
