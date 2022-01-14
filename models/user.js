const { Schema, model } = require('mongoose');

const userSchema = Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

const User = model('user', userSchema);

module.exports = {
  User,
  userSchema,
};
