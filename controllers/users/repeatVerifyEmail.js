const { User } = require('../../models')
const { sendEmail } = require('../../helpers')

const { PORT } = process.env

const repeatVerifyEmail = async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user || !email) {
    return res.status(400).json({ message: 'Missing required field email' })
  }
  if (user.verify) {
    return res
      .status(400)
      .json({ message: 'Verification has already been passed' })
  }
  const mail = {
    to: email,
    subject: 'Email confirmation',
    html: `<a target="_blank" href="http://localhost:${PORT}/api/users/verify/${user.verificationToken}'>Confirm email</a>`,
  }
  await sendEmail(mail)
  res.json({
    message: 'Verification email sent',
  })
}

module.exports = repeatVerifyEmail
