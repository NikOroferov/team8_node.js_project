const { Transaction } = require('../../models/transaction')

const getReportByMonthCategories = async (req, res, next) => {
    const { _id } = req.user

    let { date = '202201', isIncome } = req.query

    if (isIncome === 'true') {
      isIncome = true
    } else if (isIncome === 'false') {
      isIncome = false
    }

    const agg = [
      {
        $project: {
          date: {
            $dateToString: {
              format: '%Y%m',
              date: '$created_at'
            }
          },
          category: '$category',
          cost: '$cost',
          income: '$income'
        }
      }, {
        $match: {
          income: isIncome,
          date: date
        }
      }, {
        $group: {
          _id: '$category',
          totalInCategory: {
            $sum: '$cost'
          }
        }
      }, {
        $sort: {
          totalInCategory: -1
        }
      }
    ]

    const bgg = [{
      $group: {
        _id: '$owner',
        firstAdd: {
          $first: '$created_at'
        }
      }
    }]

    let result = await Transaction.find({ owner: _id })
    result = await Transaction.aggregate([agg])

    let neededDay = await Transaction.find({ owner: _id })
    neededDay = await Transaction.aggregate([bgg])

    res.json({
      status: 'success',
      code: 200,
      data: {
        result,
        neededDay
      }
    })
}

module.exports = getReportByMonthCategories
