// const validator = require('express-validator')
const { handleError } = require('../../middleware/utils')
const RateModel = require('../../models/rate')
const events = require('../../customEvents')
const Transaction = require('../../models/transaction')
const Fee = require('../../models/Fee')
// const { createItemInDb } = require('./helpers')
// const { validateBankCode, validateAccount } = require('../../middleware/utils')
// const percentageFee = Number.parseFloat(process.env.PERCENTAGE_FEE)
// const flatFee = Number.parseFloat(process.env.FLAT_FEE)

/* eslint-disable */
const createTransaction = async (req, res) => {
  try {
    const { srcCurrency, destCurrency, srcAmount, country } = req.body

    let newCurrencyPair
    if (destCurrency === 'cusd') {
      newCurrencyPair = `usd${srcCurrency}`
    } else {
      newCurrencyPair = `${destCurrency}${srcCurrency}`
    }

    // get buyRate from db
    let rateData
    if (srcCurrency === 'ghs' && destCurrency === 'cusd') {
      rateData = await RateModel.findOne({
        name: 'ghsCusdBuyRate',
        ticker: newCurrencyPair
      })
        .select('-_id')
        .lean()
    } else if (srcCurrency === 'ngn' && destCurrency === 'cusd') {
      rateData = await RateModel.findOne({
        name: 'ngnCusdBuyRate',
        ticker: newCurrencyPair
      })
        .select('-_id')
        .lean()
    } else if (srcCurrency === 'ghs' && destCurrency === 'celo') {
      rateData = await RateModel.findOne({
        name: 'ghsCeloBuyRate',
        ticker: newCurrencyPair
      })
        .select('-_id')
        .lean()
    } else if (srcCurrency === 'ngn' && destCurrency === 'celo') {
      rateData = await RateModel.findOne({
        name: 'ngnCeloBuyRate',
        ticker: newCurrencyPair
      })
        .select('-_id')
        .lean()
    } else {
      throw new Error(
        'Source currency or destination currency is not supported'
      )
    }

    // fee
    const percentageFee = await Fee.findOne({ name: 'percentagefee' })
    const rate = rateData.rate
    let destAmount = srcAmount / rate
    const txCharge = (percentageFee.amount / 100) * destAmount
    destAmount = destAmount - txCharge
    // const fee = 0.001;

    const txData = new Transaction({
      srcCurrency,
      destCurrency,
      srcAmount,
      country,
      rate: rate,
      currencyPair: newCurrencyPair,
      destAmount,
      fee: txCharge
    })
    // emit discord event
    events.emit(
      'sendDiscordWebhook',
      `BUY - ${process.env.NODE_ENV}`,
      `
          Bought ${srcAmount} ${srcCurrency.toUpperCase()} amount of ${destCurrency}

          Tx Fee  - ${txCharge}

          Amount bough(tx fee deducted) ${destCurrency} - ${destAmount} ${destCurrency}

          ${newCurrencyPair} trading at ${rate}

         `,
      process.env.DISCORD_CHANNEL
    )

    await txData.save()
    return res.status(201).json({ txData })
  } catch (error) {
    handleError(res, error)
  }
}

// destAmount: {
//   type: Number,
//   required: true
// },
// rate: {
//   type: Number,
//   required: true
// },
// fee: {
//   type: Number,
//   required: true
// },

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
// const createTransaction = async (req, res) => {
//   try {
//     let data = req.body
//     let pair, fee, finalAmount
//     if (data.destCurrency === 'ghs') {
//       pair = 'usdghs'
//     } else {
//       pair = 'usdngn'
//     }

//     let rate = rateData.rate
//     let destAmount = rate * data.srcAmount

//     if (txCharge > flatFee) {
//       fee = flatFee * rate
//     } else {
//       fee = txCharge * rate
//     }

//     let isValidBankCode = await validateBankCode(data.bankCode)
//     let validAccountNumber = await validateAccount(
//       data.bankCode,
//       data.bankAccountNumber
//     )

//     finalAmount = destAmount - fee
//     let transObj = {
//       srcCurrency: data.srcCurrency,
//       destCurrency: data.destCurrency,
//       srcAmount: data.srcAmount,
//       destAmount: finalAmount,
//       fee,
//       rate,
//       currencyPair: pair,
//       country: data.destCurrency === 'ghs' ? 'GH' : 'NG',
//       bankCode: data.bankCode,
//       bankAccountNumber: data.bankAccountNumber,
//       bankName: isValidBankCode.bankName,
//       bankAccountName: validAccountNumber.account_name
//     }
//     const item = await createItemInDb(transObj)
//     res.status(201).json(item)
//   } catch (error) {
//     handleError(res, error)
//   }
// }

module.exports = { createTransaction }
