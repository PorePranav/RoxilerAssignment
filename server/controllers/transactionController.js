const axios = require('axios');

const Transaction = require('../models/transactionModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.populateDatabase = catchAsync(async (req, res, next) => {
  const { data } = await axios.get(
    'https://s3.amazonaws.com/roxiler.com/product_transaction.json'
  );

  await Transaction.deleteMany();

  const transactionsToCreate = data.map((transaction) => {
    const dateOfSale = new Date(transaction.dateOfSale);
    const monthOfSale = dateOfSale.getMonth() + 1;

    return {
      ...transaction,
      monthOfSale: monthOfSale,
    };
  });

  await Transaction.create(transactionsToCreate);

  res.status(200).json({
    status: 'success',
    message: 'Database populated successfully!',
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const { month } = req.params;
  const parsedMonth = parseInt(month, 10);

  if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
    return next(new AppError('Invalid month parameter', 400));
  }

  const filter = { monthOfSale: parsedMonth };
  const features = new APIFeatures(Transaction.find(filter), req.query)
    .search()
    .paginate();
  const fetchedTransactions = await features.query;

  res.status(200).json({
    status: 'success',
    results: fetchedTransactions.length,
    data: fetchedTransactions,
  });
});

exports.getStatistics = catchAsync(async (req, res, next) => {
  const { month } = req.params;
  const parsedMonth = parseInt(month, 10);

  if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
    return next(new AppError('Invalid month parameter', 400));
  }

  const stats = await Transaction.aggregate([
    {
      $match: { monthOfSale: parsedMonth },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$price' },
        soldItems: { $sum: { $cond: [{ $eq: ['$sold', true] }, 1, 0] } },
        notSoldItems: { $sum: { $cond: [{ $eq: ['$sold', false] }, 1, 0] } },
      },
    },
  ]);

  if (stats.length === 0) {
    return next(
      new AppError('No transactions found for the specified month', 404)
    );
  }

  delete stats[0]._id;
  req.saleStatistics = stats[0];
  next();
});

exports.getBarChartData = catchAsync(async (req, res, next) => {
  const { month } = req.params;
  const parsedMonth = parseInt(month, 10);

  const priceRanges = [
    { range: '0 - 100', min: 0, max: 100 },
    { range: '101 - 200', min: 101, max: 200 },
    { range: '201 - 300', min: 201, max: 300 },
    { range: '301 - 400', min: 301, max: 400 },
    { range: '401 - 500', min: 401, max: 500 },
    { range: '501 - 600', min: 501, max: 600 },
    { range: '601 - 700', min: 601, max: 700 },
    { range: '701 - 800', min: 701, max: 800 },
    { range: '801 - 900', min: 801, max: 900 },
    { range: '901 - above', min: 901, max: Infinity },
  ];

  const stats = await Transaction.aggregate([
    {
      $match: { monthOfSale: parsedMonth },
    },
    {
      $group: {
        _id: null,
        counts: {
          $push: {
            range: {
              $switch: {
                branches: priceRanges.map((range, index) => ({
                  case: {
                    $and: [
                      { $gte: ['$price', range.min] },
                      { $lte: ['$price', range.max] },
                    ],
                  },
                  then: index,
                })),
                default: 9,
              },
            },
          },
        },
      },
    },
  ]);

  if (stats.length === 0) {
    return res
      .status(404)
      .json({ error: 'No transactions found for the specified month' });
  }

  const counts = stats[0].counts;
  const responseData = priceRanges.map((range, index) => ({
    label: range.range,
    count: counts.filter((item) => item.range === index).length,
  }));

  req.barChartData = responseData;
  next();
});

exports.getPieChartData = catchAsync(async (req, res, next) => {
  const { month } = req.params;
  const parsedMonth = parseInt(month, 10);

  const results = await Transaction.aggregate([
    {
      $match: { monthOfSale: parsedMonth },
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        count: 1,
      },
    },
  ]);

  if (results.length === 0) {
    return res
      .status(404)
      .json({ error: 'No transactions found for the specified month' });
  }

  res.status(200).json({
    status: 'success',
    data: {
      saleStatistics: req.saleStatistics,
      barChartData: req.barChartData,
      pieChartData: results,
    },
  });
});
