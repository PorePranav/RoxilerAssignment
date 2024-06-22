const express = require('express');
const transactionController = require('../controllers/transactionController');

const router = express.Router();

router.get('/populateDatabase', transactionController.populateDatabase);
router.get(
  '/statistics/:month',
  transactionController.getStatistics,
  transactionController.getBarChartData,
  transactionController.getPieChartData
);
router.get('/:month', transactionController.getAllProducts);

module.exports = router;
