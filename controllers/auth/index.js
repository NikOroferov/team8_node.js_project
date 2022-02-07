const register = require('./register');
const login = require('./login');
const { googleLogin, googleRedirect } = require('./googleLogin');
const logout = require('./logout');
const forgotPassword = require('./forgotPassword');

module.exports = {
  register,
  login,
  googleLogin,
  googleRedirect,
  logout,
  forgotPassword,
};
