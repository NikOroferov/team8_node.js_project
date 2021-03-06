const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

const userSchema = Schema(
  {
    name: {},
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
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
    avatar: {
      type: Schema.Types.Mixed,
    },
    balance: {
      type: Number,
      default: null,
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
      default: false,
      required: [true, 'verificationToken is required'],
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const joiUserSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
  balance: Joi.number().positive().allow(0),
});

const User = model('user', userSchema);

module.exports = {
  User,
  userSchema,
  joiUserSchema,
};
