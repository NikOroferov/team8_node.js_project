const { NotFound, BadRequest } = require('http-errors');
const { Transaction } = require('../../models');
const { Category } = require('../../models');

const addExpenseTransaction = async (req, res) => {
  const { balance } = req.user;
  const { categoryId } = req.params;
  const { day, month, year } = req.query;
  const { description, value } = req.body;

  const category = await Category.findById({ _id: categoryId });

  if (!balance) {
    throw new BadRequest('There are no money on your balance');
  }

  if (!category) {
    throw new NotFound('Category not found');
  }

  const { name, typeOfOperation, icon } = category;
  const typeTransaction = typeOfOperation === false ? 'Expenses' : 'Incomes';

  const newTransaction = {
    // ...req.body,
    date: {
      day,
      month,
      year,
    },
    description:
      description.toLowerCase().charAt(0).toUpperCase() + description.slice(1),
    value,
    owner: req.user._id,
    category: name,
    expenses: typeOfOperation,
    typeTransaction,
    icon,
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

module.exports = addExpenseTransaction;
