const register = require('./register');
const login = require('./login');
const googleLogin = require('./googleLogin');
const logout = require('./logout');
const forgotPasswordController = require('./forgotPasswordController');

module.exports = {
  register,
  login,
  logout,
  forgotPasswordController,
  googleLogin,
};
