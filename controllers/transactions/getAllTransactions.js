const { NotFound } = require('http-errors');
const { Transaction } = require('../../models');

const getAllTransactions = async (req, res) => {
  const { _id } = req.user;
  const { isIncome } = req.query;

  const transactions = req.query.isIncome
    ? await Transaction.find({ owner: _id, incomes: isIncome }).sort({"createdDate": -1})
    : await Transaction.find({ owner: _id }).sort({"createdDate": -1});

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

module.exports = getAllTransactions;
