const { NotFound, BadRequest } = require('http-errors');
const { Transaction } = require('../../models');
// const { Category } = require('../../models');

const addTransaction = async (req, res) => {
  const { _id } = req.user;
  const { categoryId } = req.params;
  const { created_at, subcategory, category, transactionType, costs, incomes } =
    req.body;

  const category = await Category.findById({ _id: categoryId });

  // if (!balance) {
  //   throw new BadRequest('There are no money on your balance');
  // }

  // if (!category) {
  //   throw new NotFound('Category not found');
  // }

  // const { name, typeOfOperation, icon } = category;
  // const typeTransaction = typeOfOperation === false ? 'Expenses' : 'Incomes';

  const newTransaction = {
    created_at,
    subcategory,
    category,
    transactionType,
    costs,
    incomes,
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
