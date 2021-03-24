// const validator = require('express-validator')
const { handleError } = require('../../middleware/utils')
const events = require('../../customEvents')
const Transaction = require('../../models/transaction')
const Fee = require('../../models/Fee')
const resolveBankAccountLib = require('../../middleware/utils/resolveBankAccountLib')
const tickerLib = require('../../middleware/utils/tickerLib')
const rateLib = require('../../middleware/utils/rateLib')
// const { createItemInDb } = require('./helpers')

/* eslint-disable */
const createBuyTransaction = async (req, res) => {
  try {
    const { srcCurrency, destCurrency, srcAmount, country, address } = req.body
    const srcArray = ['ngn', 'ghs']
    const destArray = ['cusd', 'celo']

    if (!srcArray.includes(srcCurrency)) {
      throw new Error('WRONG_SOURCE')
    }

    if (!destArray.includes(destCurrency)) {
      throw new Error('WRONG_DESTINATION')
    }
    const newCurrencyPair = await tickerLib.getTicker(srcCurrency, destCurrency)

    // get buyRate from db
    const rateData = await rateLib.getBuyRateData(
      srcCurrency,
      destCurrency,
      newCurrencyPair
    )

    // fee
    const percentageFee = await Fee.findOne({ name: 'percentagefee' })
    // const rate = rateData
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
      address,
      destAmount,
      fee: txCharge,
      type: 'buy'
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
/* eslint-disable */

const createSellTransaction = async (req, res) => {
  try {
    const {
      srcCurrency,
      destCurrency,
      srcAmount,
      country,
      bankCode,
      bankAccountNumber,
      bankName,
      accountName
    } = req.body

    const newCurrencyPair = await tickerLib.getTicker(destCurrency, srcCurrency)
    const resolveBankAccount = await resolveBankAccountLib.resolveBankaccount(
      destCurrency,
      bankAccountNumber,
      bankCode,
      bankName,
      accountName
    )
    // get rate
    const rateData = await rateLib.getSellRateData(
      destCurrency,
      srcCurrency,
      newCurrencyPair
    )
    const percentageFee = await Fee.findOne({ name: 'percentagefee' })
    const rate = rateData.rate
    let destAmount = srcAmount * rate
    const txFee = percentageFee.amount / 100
    const txCharge = txFee * destAmount
    const updatedDestAmount = destAmount - txCharge
    const txData = new Transaction({
      ...resolveBankAccount,
      type: 'sell',
      srcCurrency,
      destCurrency,
      srcAmount,
      country,
      rate: rate,
      currencyPair: newCurrencyPair,
      destAmount: updatedDestAmount,
      fee: txCharge
    })
    // emit discord event
    events.emit(
      'sendDiscordWebhook',
      `Sell - ${process.env.NODE_ENV}`,
      `
          Selling ${srcAmount}  worth of ${srcCurrency.toUpperCase()} tokens

          Amount to be sent ${destCurrency} -   ${destAmount} ${destCurrency.toUpperCase()}

          ${newCurrencyPair} sell rate -  ${rate}

          Tx Fee - ${txFee}%

          Amount Deducted - ${txCharge} ${destCurrency.toUpperCase()}

          Updated Amount to Send - ${updatedDestAmount} ${destCurrency.toUpperCase()}
          `,
      process.env.DISCORD_CHANNEL
    )
    await txData.save()
    return res.status(201).json({ txData })
  } catch (error) {
    console.log(error)
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

module.exports = { createBuyTransaction, createSellTransaction }
