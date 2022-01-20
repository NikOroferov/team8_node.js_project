const register = require('./register');
const login = require('./login');
const googleLogin = require('./googleLogin');
const logout = require('./logout');
const forgotPasswordController = require('./forgotPasswordController');
// const google = require('./google');

module.exports = {
  register,
  login,
  logout,
  forgotPasswordController,
  googleLogin,
  // google,
};
