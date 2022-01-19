const express = require('express');
const router = express.Router();
const { transactions: ctrl } = require('../../controllers');
const {
  controllerWrapper,
  validation,
  authenticate,
} = require('../../middlewares');
const { transactionsSchemaJoi } = require('../../models/transactions');

router.get(
  '/expense',
  authenticate,
  controllerWrapper(ctrl.getExpenseTransactions),
);
router.get(
  '/income',
  authenticate,
  controllerWrapper(ctrl.getIncomeTransactions),
);

router.post(
  '/expense/:categoryId',
  authenticate,
  validation(transactionsSchemaJoi),
  controllerWrapper(ctrl.addExpenseTransaction),
);
router.delete(
  '/:transactionId',
  authenticate,
  controllerWrapper(ctrl.deleteTransaction),
);

router.post(
  '/income/:categoryId',
  authenticate,
  validation(transactionsSchemaJoi),
  controllerWrapper(ctrl.addIncomTransaction),
);

router.get(
  '/category-by-month',
  authenticate,
  controllerWrapper(ctrl.getReportByMonthCategories),
);

module.exports = router;
