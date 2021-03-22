const mongoose = require('mongoose')
// const validator = require('validator')
const mongoosePaginate = require('mongoose-paginate-v2')

const TransactionSchema = new mongoose.Schema(
  {
    srcCurrency: {
      type: String,
      enum: ['ghs', 'ngn'],
      required: true
    },
    destCurrency: {
      type: String,
      enum: ['celo', 'cusd'],
      required: true
    },
    type: {
      type: String,
      enum: ['buy', 'sell']
      // required: true
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
    bankDetails: {
      bankName: {
        type: String
      },
      bankCode: {
        type: String
      },
      bankAccountNumber: {
        type: String
      },
      bankAccountName: {
        type: String
      }
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
