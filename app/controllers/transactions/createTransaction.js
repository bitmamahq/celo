const validator = require('express-validator')
const { handleError } = require('../../middleware/utils')
const RateModel = require('../../models/rate')
const { createItemInDb } = require('./helpers')
const { validateBankCode, validateAccount } = require('../../middleware/utils')
const percentageFee = Number.parseFloat(process.env.PERCENTAGE_FEE)
const flatFee = Number.parseFloat(process.env.FLAT_FEE)

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createTransaction = async (req, res) => {
  try {
    let data = req.body
    let pair, fee, finalAmount
    if (data.destCurrency === 'ghs') {
      pair = 'usdghs'
    } else {
      pair = 'usdngn'
    }

    let rateData = await RateModel.findOne({ name: pair }).select('-_id').lean()
    let rate = rateData.rate
    let destAmount = rate * data.srcAmount
    let txCharge = (percentageFee / 100) * data.srcAmount

    if (txCharge > flatFee) {
      fee = flatFee * rate
    } else {
      fee = txCharge * rate
    }

    let isValidBankCode = await validateBankCode(data.bankCode)
    let validAccountNumber = await validateAccount(
      data.bankCode,
      data.bankAccountNumber
    )

    finalAmount = destAmount - fee
    let transObj = {
      srcCurrency: data.srcCurrency,
      destCurrency: data.destCurrency,
      srcAmount: data.srcAmount,
      destAmount: finalAmount,
      fee,
      rate,
      currencyPair: pair,
      country: data.destCurrency === 'ghs' ? 'GH' : 'NG',
      bankCode: data.bankCode,
      bankAccountNumber: data.bankAccountNumber,
      bankName: isValidBankCode.bankName,
      bankAccountName: validAccountNumber.account_name
    }
    const item = await createItemInDb(transObj)
    res.status(201).json(item)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { createTransaction }
