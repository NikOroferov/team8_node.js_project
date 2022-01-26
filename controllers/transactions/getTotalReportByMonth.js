const ObjectId = require('mongodb').ObjectId;
const { Transaction } = require('../../models');

const getTotalReportByMonth = async (req, res) => {
  const { _id } = req.user;
  const id = _id.toString();

  const { date = '202201' } = req.query;

  const totalReportByIncomes = [
    {
      $project: {
        period: {
          $dateToString: {
            format: '%Y%m',
            date: '$createdDate',
          },
        },
        costs: 1,
        incomes: 1,
        owner: 1,
        transactionType: 1,
      },
    },
    {
      $match: {
        period: date,
        owner: ObjectId(id),
      },
    },
    {
      $group: {
        _id: '$incomes',
        total: {
          $sum: '$costs',
        },
        transactionType: {
          $first: '$transactionType',
        },
      },
    },
    {
      $sort: {
        transactionType: -1
      }
    }
  ];

  const result = await Transaction.aggregate([totalReportByIncomes]);

  res.json({
    status: 'success',
    code: 200,
    data: {
      result,
    },
  });
};

module.exports = getTotalReportByMonth;
