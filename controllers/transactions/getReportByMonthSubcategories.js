const ObjectId = require('mongodb').ObjectId;
const { Transaction } = require('../../models');

const getReportByMonthSubcategories = async (req, res) => {
  const { _id } = req.user;
  const id = _id.toString();

  let { date = '202201', isIncome, category } = req.query;

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
        owner: 1,
      },
    },
    {
      $match: {
        incomes: isIncome,
        alias: category,
        period: date,
        owner: ObjectId(id),
      },
    },
    {
      $group: {
        _id: '$subcategory',
        totalInSubcategory: {
          $sum: '$costs',
        },
        count: {
          $sum: 1,
        }
      },
    },
    {
      $sort: {
        totalInSubcategory: -1,
      },
    },
  ];
  
  const result = await Transaction.aggregate([agg]);

  res.json({
    status: 'success',
    code: 200,
    data: {
      result,
    },
  });
};

module.exports = getReportByMonthSubcategories;
