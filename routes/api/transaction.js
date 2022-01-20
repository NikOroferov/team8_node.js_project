const express = require('express');
const router = express.Router();
const { transactions: ctrl } = require('../../controllers');
const { ctrlWrapper, validation, auth } = require('../../middlewares');
const { transactionsSchemaJoi } = require('../../models/transaction');

router.get('/', auth, ctrlWrapper(ctrl.getAllTransactions));

router.post(
  '/:categoryId',
  auth,
  validation(transactionsSchemaJoi),
  ctrlWrapper(ctrl.addTransaction),
);
router.delete('/:transactionId', auth, ctrlWrapper(ctrl.deleteTransaction));

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
