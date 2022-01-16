const ctrlWrapper = require('./ctrlWrapper');
const auth = require('./auth');
const validation = require('./validation');
const upload = require('./upload');
const forgotPassword = require('./forgotPassword');

module.exports = {
  ctrlWrapper,
  validation,
  auth,
  upload,
  forgotPassword,
};
