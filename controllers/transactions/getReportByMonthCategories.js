const { Transaction } = require('../../models/transaction')

const reportByMonthCategory = async (req, res, next) => {
    const { _id } = req.user
    const { date, isIncome } = req.body


    const agg = [
      {
        $project: {
          date: {
            $dateToString: {
              format: '%m-%Y',
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

module.exports = reportByMonthCategory
