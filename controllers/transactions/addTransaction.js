const { NotFound, BadRequest } = require('http-errors');
const { Transaction } = require('../../models');
const { Category } = require('../../models');
const { User } = require('../../models');

const addTransaction = async (req, res) => {
  const { _id, balance } = req.user;
  
  const { createdDate, subcategory, category, transactionType, costs, incomes, year, month, day } =
  req.body;

  const categoryInfo = await Category.findOne({ category });

  if (!categoryInfo) {
    throw new NotFound('Category is not found');
  }

  const { alias, icon } = categoryInfo;

  const newTransaction = {
    createdDate,
    subcategory,
    category,
    transactionType,
    costs,
    incomes,
    alias,
    icon,
    date: {
      year, 
      month, 
      day,
    },
    owner: _id,
  };

  const updatedBalance = incomes === false ? balance - costs : balance + costs;

  if (updatedBalance < 0) {
    throw new BadRequest('There are no enough money for this purchase');
  }

  await User.findByIdAndUpdate(
    { _id },
    { balance: updatedBalance }
  );

  const result = await Transaction.create(newTransaction);
  res.status(201).json({
    status: 'succes',
    code: 201,
    data: {
      result,
      balance: updatedBalance,
    },
  });
};

module.exports = addTransaction;
