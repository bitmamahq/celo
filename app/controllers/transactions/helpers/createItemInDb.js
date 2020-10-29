const Transaction = require('../../../models/transaction')
const { buildErrObject } = require('../../../middleware/utils')

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */
const createItemInDb = ({
  srcCurrency = '',
  destCurrency = '',
  srcAmount = '',
  destAmount = '',
  rate = '',
  currencyPair = '',
  status = '',
  userId = ''
}) => {
  return new Promise((resolve, reject) => {
    const transaction = new Transaction({
      srcCurrency,
      destCurrency,
      srcAmount,
      destAmount,
      rate,
      currencyPair,
      status,
      userId
    })
    transaction.save((err, item) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }

      item = JSON.parse(JSON.stringify(item))
      resolve(item)
    })
  })
}

module.exports = { createItemInDb }
