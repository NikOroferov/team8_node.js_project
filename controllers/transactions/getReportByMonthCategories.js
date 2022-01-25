const ObjectId = require('mongodb').ObjectId;
const { Transaction } = require('../../models');

const getReportByMonthCategories = async (req, res) => {
  const { _id } = req.user;
  const id = _id.toString();

  let { date, isIncome } = req.query;

  if (isIncome === 'true') {
    isIncome = true;
  } else if (isIncome === 'false') {
    isIncome = false;
  }

  const sortTransactionByCategoryByMonth = [
    {
      $project: {
        period: {
          $dateToString: {
            format: '%Y%m',
            date: '$createdDate',
          },
        },
        category: 1,
        costs: 1,
        incomes: 1,
        subcategory: 1,
        alias: 1,
        owner: 1,
        icon: 1
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
        },
        icon: {
          $first: '$icon'
      }
      },
    },
    {
      $sort: {
          totalInCategory: -1
      }
    },
    {
      $project: {
          id: '$alias',
          icon: 1,
          totalInCategory: 1,
          category_title: '$_id',
          category: '$alias',
          _id: 0
      }
  }
  ];
  
  const foundFirstTransactionByUser = [
    {
        $match: {
          owner: ObjectId(id),
        },
      },
    {
      $group: {
        _id: '$owner',
        firstAdd: {
          $first: '$createdDate',
        },
      },
    },
    {
      $project: {
          date: {
              $dateToString: {
                  format: '%Y%m',
                  date: '$firstAdd'
              }
          }
      }
    }
  ];

  const result = await Transaction.aggregate([sortTransactionByCategoryByMonth]);

  const firstDate = await Transaction.aggregate([foundFirstTransactionByUser]);

  res.json({
    status: 'success',
    code: 200,
    data: {
      result,
      firstDate,
    },
  });
};

module.exports = getReportByMonthCategories;
