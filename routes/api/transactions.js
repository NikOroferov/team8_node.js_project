const express = require('express');
const router = express.Router();
const { transactions: ctrl } = require('../../controllers');
const { ctrlWrapper, validation, auth } = require('../../middlewares');
const { transactionsSchemaJoi } = require('../../models/transactions');

router.get('/expense', auth, ctrlWrapper(ctrl.getExpenseTransactions));
router.get('/income', auth, ctrlWrapper(ctrl.getIncomeTransactions));

router.post(
  '/expense/:categoryId',
  auth,
  validation(transactionsSchemaJoi),
  ctrlWrapper(ctrl.addExpenseTransaction),
);
router.delete('/:transactionId', auth, ctrlWrapper(ctrl.deleteTransaction));

router.post(
  '/income/:categoryId',
  auth,
  validation(transactionsSchemaJoi),
  ctrlWrapper(ctrl.addIncomTransaction),
);

router.get(
  '/category-by-month',
  auth,
  ctrlWrapper(ctrl.getReportByMonthCategories),
);

module.exports = router;
