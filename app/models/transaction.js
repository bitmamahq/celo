const mongoose = require('mongoose')
const validator = require('validator')
const mongoosePaginate = require('mongoose-paginate-v2')

const TransactionSchema = new mongoose.Schema(
  {
    srcCurrency: {
      type: String,
      required: true
    },
    destCurrency: {
      type: String,
      required: true
    },
    srcAmount: {
      type: Number,
      required: true
    },
    destAmount: {
      type: Number,
      required: true
    },
    rate: {
      type: Number,
      required: true
    },
    fee: {
      type: Number,
      required: true
    },
    currencyPair: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    bankName: {
      type: String
    },
    bankCode: {
      type: String
    },
    bankAccountNumber: {
      type: String
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'processing', 'completed', 'failed'],
      required: true
    },
    reason: {
      type: String
    },
    userId: {
      type: mongoose.ObjectId,
      ref: 'User'
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

TransactionSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Transaction', TransactionSchema)
