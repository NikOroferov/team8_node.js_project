const { NotFound } = require('http-errors');
const { Transaction } = require('../../models');
const { Category } = require('../../models');

const addTransaction = async (req, res) => {
  const { _id } = req.user;
  
  const { date, subcategory, category, transactionType, costs, incomes, year, month, day } =
  req.body;

  const categoryInfo = await Category.findOne({ category });

  if (!categoryInfo) {
    throw new NotFound('Category is not found');
  }

  const { alias, icon } = categoryInfo;

  const newTransaction = {
    created_at: date,
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

  const result = await Transaction.create(newTransaction);
  res.status(201).json({
    status: 'succes',
    code: 201,
    data: {
      result,
    },
  });
};

module.exports = addTransaction;
