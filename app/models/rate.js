const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const RateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    rate: {
      type: Number,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)
RateSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Rate', RateSchema)
