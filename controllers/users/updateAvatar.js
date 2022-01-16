const { User } = require('../../models')
const path = require('path')
const fs = require('fs/promises')
const jimp = require('jimp')

const avatarsDir = path.join(__dirname, '../../', 'public', 'avatars')

const updateAvatar = async (req, res) => {
  const { path: tempUpload, originalname } = req.file
  const { _id: id } = req.user
  const imageName = `${id}_${originalname}`
  try {
    const image = await jimp.read(tempUpload)
    image.resize(250, 250, jimp.AUTO).writeAsync(tempUpload)
    const resultUpload = path.join(avatarsDir, imageName)
    await fs.rename(tempUpload, resultUpload)
    const avatarURL = path.join('public', 'avatars', imageName)
    await User.findByIdAndUpdate(req.user_id, { avatarURL }, { new: true })

    res.json({ avatarURL })
  } catch (error) {
    await fs.unlink(tempUpload)
    throw error
  }
}
module.exports = updateAvatar
