const register = require('./register');
const login = require('./login');
const googleLogin = require('./googleLogin');
const googleRedirect = require('./googleLogin');
const logout = require('./logout');
const forgotPasswordController = require('./forgotPasswordController');

module.exports = {
  register,
  login,
  googleLogin,
  googleRedirect,
  logout,
  forgotPasswordController,
};
