const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const FeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    amount: {
      type: String
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)
FeeSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Fee', FeeSchema)
