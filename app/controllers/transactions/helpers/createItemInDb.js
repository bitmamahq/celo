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
  fee = '',
  currencyPair = '',
  country = '',
  bankCode = '',
  bankAccountNumber = '',
  bankName = ''
}) => {
  return new Promise((resolve, reject) => {
    const transaction = new Transaction({
      srcCurrency,
      destCurrency,
      srcAmount,
      destAmount,
      rate,
      currencyPair,
      fee,
      country,
      bankCode,
      bankAccountNumber,
      bankName
    })

    transaction.save((err, item) => {
      if (err) {
        return reject(buildErrObject(422, err.message))
      }

      item = JSON.parse(JSON.stringify(item))
      return resolve(item)
    })
  })
}

module.exports = { createItemInDb }
