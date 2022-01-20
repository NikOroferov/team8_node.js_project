const ObjectId = require('mongodb').ObjectId;
const { Transaction } = require('../../models');

const getReportByMonthCategories = async (req, res) => {
  const { _id } = req.user;
  const id = _id.toString();

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
        owner: 1,
      },
    },
    {
      $match: {
        incomes: isIncome,
        period: date,
        owner: ObjectId(id),
      },
    },
    {
      $group: {
        _id: '$category',
        totalInCategory: {
          $sum: '$costs',
        },
        alias: {
          $first: '$alias',
        }
      },
    },
  ];
  
  // const bgg = [
  //   {
  //       $match: {
  //         owner: ObjectId(id),
  //       },
  //     },
  //   {
  //     $group: {
  //       _id: '$owner',
  //       firstAdd: {
  //         $first: '$created_at',
  //       },
  //     },
  //   },
  // ];

  const result = await Transaction.aggregate([agg]);

  // let neededDay = await Transaction.find({ owner: _id });
  // neededDay = await Transaction.aggregate([bgg]);

  res.json({
    status: 'success',
    code: 200,
    data: {
      result,
      // neededDay,
    },
  });
};

module.exports = getReportByMonthCategories;
