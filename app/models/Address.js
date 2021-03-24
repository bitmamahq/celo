const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const AddressSchema = new mongoose.Schema(
  {
    coin: {
      type: String,
      required: true
    },
    label: {
      type: Number
      // required: true
    },
    balance: {
      type: 'Decimal128',
      default: '0.00000000'
    },
    lastDepost: {
      type: String
    },
    lastWithdrawal: {
      type: String
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)
AddressSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Address', AddressSchema)
