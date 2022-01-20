const { Transaction } = require('../../models');

const getReportByMonthCategories = async (req, res, next) => {
  const { _id } = req.user;

  let { date = '202201', isIncome } = req.query;

  if (isIncome === 'true') {
    isIncome = true;
  } else if (isIncome === 'false') {
    isIncome = false;
  }

  const agg = [
    {
      $project: {
        period: {
          $dateToString: {
            format: '%Y%m',
            date: '$created_at',
          },
        },
        category: 1,
        costs: 1,
        incomes: 1,
        subcategory: 1,
        alias: 1,
      },
    },
    {
      $match: {
        incomes: isIncome,
        period: date
      },
    },
    {
      $group: {
        _id: '$category',
        totalInSubcategory: {
          $sum: '$costs',
        },
        alias: {
          $first: '$alias',
        },
      },
    },
    {
      $sort: {
        totalInSubcategory: -1,
      },
    },
  ];

  const bgg = [
    {
      $group: {
        _id: '$owner',
        firstAdd: {
          $first: '$created_at',
        },
      }
    },
  ];

  // let result = await Transaction.find({ owner: _id });
  const result = await Transaction.aggregate([agg]);

  let neededDay = await Transaction.find({ owner: _id });
  neededDay = await Transaction.aggregate([bgg]);

  res.json({
    status: 'success',
    code: 200,
    data: {
      result,
      neededDay,
    },
  });
};

module.exports = getReportByMonthCategories;
