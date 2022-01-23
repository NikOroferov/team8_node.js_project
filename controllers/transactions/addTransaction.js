const { NotFound, BadRequest } = require('http-errors');
const { Transaction } = require('../../models');
const { Category } = require('../../models');
const { User } = require('../../models');

const addTransaction = async (req, res) => {
  const { _id, balance } = req.user;
  
  const { created_at, subcategory, category, transactionType, costs, incomes, year, month, day } =
  req.body;

  const categoryInfo = await Category.findOne({ category });

  if (!categoryInfo) {
    throw new NotFound('Category is not found');
  }

  const { alias, icon } = categoryInfo;

  const newTransaction = {
    created_at,
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

  const updateBalance = incomes === false ? balance - costs : balance + costs;

  if (updateBalance < 0) {
    throw new BadRequest('There are no enough money for this purchase');
  }

  await User.findByIdAndUpdate(
    { _id },
    { balance: updateBalance }
  );

  const result = await Transaction.create(newTransaction);
  res.status(201).json({
    status: 'succes',
    code: 201,
    data: {
      result,
      balance: updateBalance,
    },
  });
};

module.exports = addTransaction;
