const { Schema, model } = require('mongoose');
const Joi = require('joi');

const transactionSchema = Schema({
  category: {
    type: String,
    required: [true, 'Select a category'],
    // enum: [
    //   'продукты',
    //   'алкоголь',
    //   'развлечения',
    //   'здоровье',
    //   'транспорт',
    //   'всё для дома',
    //   'техника',
    //   'коммуналка, связь',
    //   'спорт, хобби',
    //   'образование',
    //   'прочее',
    //   'зп',
    //   'дополнительные доходы',
    // ],
  },
  subcategory: {
    type: String,
    required: true,
  },
  transactionType: {
    type: String,
    required: true,
    enum: ['расход', 'доход'],
  },
  createdDate: {
    type: Date,
    default: new Date().toISOString(),
  },
  costs: {
    type: Number,
    required: true,
  },
  incomes: {
    type: Boolean,
    default: true,
  },
  alias: {
    type: String
  },
  icon: {
    type: String
  },
  date: {
    type: Object
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  }
});

const joiTransactionSchema = Joi.object({
  createdDate: Joi.string(),
  category: Joi.string().required(),
  transactionType: Joi.string().required(),
  subcategory: Joi.string().required(),
  costs: Joi.number().required(),
  incomes: Joi.boolean().required(),
  year: Joi.number(),
  month: Joi.number(),
  day: Joi.number()
})

const Transaction = model('transaction', transactionSchema)

module.exports = {
  Transaction,
  transactionSchema,
  joiTransactionSchema,
};
