const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A product must have a title'],
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price'],
  },
  description: {
    type: String,
    required: [true, 'A product must have a description'],
  },
  category: {
    type: String,
    required: [true, 'A product must have a category'],
    enum: [`men's clothing`, 'jewelery', 'electronics', `women's clothing`],
  },
  image: {
    type: String,
    required: [true, 'A product must have an image'],
  },
  sold: {
    type: Boolean,
    required: [true, 'A product must have a sold status'],
  },
  dateOfSale: {
    type: Date,
    required: [true, 'A product must have a date of sale'],
  },
  monthOfSale: {
    type: Number,
    required: [true, 'A product must have a month of sale'],
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
