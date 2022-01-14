const { Schema, model } = require('mongoose');

const transactionSchema = Schema({
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  cost: {
    type: Number,
    required: true,
  },
  income: {
    type: Boolean,
    default: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
});

const Transaction = model('transaction', transactionSchema);

module.exports = {
  transactionSchema,
  Transaction,
};
