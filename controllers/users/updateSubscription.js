const { User } = require('../../models')

const updateSubscription = async (req, res, next) => {
  const { id } = req.params
  const { subscription } = req.body
  const result = await User.findByIdAndUpdate(
    id,
    { subscription },
    { new: true }
  )
  if (!result) {
    res.status(400).json(`User with id=${id} missing field subscription`)
  }
  res.json({
    status: 'succes',
    code: 200,
    message: 'user updated',
    result: { subscription },
  })
}

module.exports = updateSubscription
