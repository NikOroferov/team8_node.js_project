const ObjectId = require('mongodb').ObjectId;
const { Transaction } = require('../../models');

const getResumeReport = async (req, res) => {
  const { _id } = req.user;
  const id = _id.toString();

  let { isIncome } = req.query;

  if (isIncome === 'true') {
    isIncome = true;
  } else if (isIncome === 'false') {
    isIncome = false;
  }

  const dateToday = new Date(Date.now()).toISOString();
  
  const sixMonthAgo = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 6, 
      new Date().getDate()
  ).toISOString();

  const allTransactionLastSixMonth = [
    {
      $match: {
        incomes: isIncome,
        owner: ObjectId(id),
      },
    },
    {
      $match: {
        createdDate: {
          $gte: new Date(sixMonthAgo),
          $lt: new Date(dateToday),
        },
      },
    },
    {
      $group: {
        _id: {
          month: {
            $month: '$createdDate',
          },
        },
        total: {
          $sum: '$costs',
        },
        transactionType: {
          $first: '$transactionType',
        },
        year: {
          $first: '$date.year',
        },
      },
    },
    {
      $project: {
        total: 1,
        year: 1,
        transactionType: 1,
        month: '$_id.month',
        _id: '$_id.month',
      },
    },
    {
      $sort: {
        year: -1,
        month: -1,
      },
    },
  ];

  const result = await Transaction.aggregate([allTransactionLastSixMonth]);

  res.json({
    status: 'success',
    code: 200,
    data: {
      result,
    },
  });
};

module.exports = getResumeReport;
