const express = require('express');
const router = express.Router();
const { transactions: ctrl } = require('../../controllers');
const { ctrlWrapper, validation, auth } = require('../../middlewares');
const { transactionsSchemaJoi } = require('../../models/transaction');

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
  '/category-by-month', // подправить рут
  auth,
  ctrlWrapper(ctrl.getReportByMonthCategories),
);

router.get(
  '/subcategory-by-month',
  auth,
  ctrlWrapper(ctrl.getReportByMonthSubcategories),
);

module.exports = router;
