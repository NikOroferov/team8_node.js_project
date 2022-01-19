const { Schema, model } = require('mongoose');
const Joi = require('joi');

const transactionSchema = Schema({
  category: {
    type: String,
    required: [true, 'Select a category'],
    enum: [
      'Продукты',
      'Алкоголь',
      'Развлечения',
      'Здоровье',
      'Транспорт',
      'Всё для дома',
      'Техника',
      'Коммуналка, связь',
      'Спорт, хобби',
      'Образование',
      'Прочее',
      'ЗП',
      'Дополнительные доходы',
    ],
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
  created_at: {
    type: Date,
    default: Date.now(),
  },
  costs: {
    type: Number,
    required: true,
  },
  incomes: {
    type: Boolean,
    default: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

const joiTransactionSchema = Joi.object({
  created_at: Joi.string().required(),
  category: Joi.string().required(),
  transactionType: Joi.string().required(),
});

const Transaction = model('transaction', transactionSchema);

module.exports = {
  transactionSchema,
  Transaction,
  joiTransactionSchema,
};
