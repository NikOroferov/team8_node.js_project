const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

const userSchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: value => value.includes('@'),
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
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
      default: 0,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = function (password) {
  if (!password || !this.password) return false;
  return bcrypt.compareSync(password, this.password);
};

const joiUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
  balance: Joi.number().required(),
});

const User = model('user', userSchema);

module.exports = {
  User,
  userSchema,
  joiUserSchema,
};
