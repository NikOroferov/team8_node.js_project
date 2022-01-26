const express = require('express');
const router = express.Router();
const { transactions: ctrl } = require('../../controllers');
const { ctrlWrapper, validation, auth } = require('../../middlewares');
const { joiTransactionSchema } = require('../../models/transaction');

router.get('/', auth, ctrlWrapper(ctrl.getAllTransactions));

router.post(
  '/',
  auth,
  validation(joiTransactionSchema),
  ctrlWrapper(ctrl.addTransaction),
);

router.delete('/:transactionId', auth, ctrlWrapper(ctrl.deleteTransaction));

router.get(
  '/category-by-month', 
  auth,
  ctrlWrapper(ctrl.getReportByMonthCategories),
);

router.get(
  '/subcategory-by-month',
  auth,
  ctrlWrapper(ctrl.getReportByMonthSubcategories),
);

router.get(
  '/total-by-month',
  auth,
  ctrlWrapper(ctrl.getTotalReportByMonth),
);

router.get(
  '/summary',
  auth,
  ctrlWrapper(ctrl.getResumeReport),
);

module.exports = router;
