// const validator = require('express-validator')
const { handleError } = require('../../middleware/utils')
const RateModel = require('../../models/rate')
const events = require('../../customEvents')
const Transaction = require('../../models/transaction')
const Fee = require('../../models/Fee')
const axiosLib = require('../../middleware/utils/axiosLib')
// const { createItemInDb } = require('./helpers')

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
      fee: txCharge,
      type: 'Buy'
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
    return res.status(201).json({ ...txData })
  } catch (error) {
    handleError(res, error)
  }
}
/* eslint-disable */

const createWithdrawalTransaction = async (req, res) => {
  try {
    const {
      srcCurrency,
      destCurrency,
      srcAmount,
      country,
      bankCode,
      bankAccountNumber,
      bankName,
      account_name
    } = req.body
    const obj = {
      srcCurrency,
      destCurrency,
      srcAmount,
      country,
      bankCode,
      bankAccountNumber,
      bankName,
      account_name
    }
    let txData
    let newCurrencyPair

    // set ticker
    if (srcCurrency === 'cusd') {
      newCurrencyPair = `usd${destCurrency}`
    } else {
      newCurrencyPair = `${srcCurrency}${destCurrency}`
    }
    // resolve account
    const axiosBody = {
      accountNumber: bankAccountNumber,
      bankCode: bankCode
    }
    const axiosHeaders = {
      'Content-Type': 'application/json',
      token: process.env.ENTERPRISE_TOKEN
    }

    if (destCurrency === 'ngn') {
      const resolveBankEndpoint = `${process.env.ENTERPRISE_BASE_URL}v1/banks/resolve`
      const resolveBankAccount = await axiosLib.post(
        resolveBankEndpoint,
        axiosBody,
        axiosHeaders
      )
      // const ngBanksEndpoint = `${process.env.ENTERPRISE_BASE_URL}v1/banks/ng`
      txData = {
        'bankDetails.bankName': bankName,
        'bankDetails.bankCode': bankCode,
        'bankDetails.bankAccountNumber':
          resolveBankAccount.data.message.data.account_number,
        'bankDetails.bankAccountName':
          resolveBankAccount.data.message.data.account_name
      }
    } else {
      // const ghBanksEndpoint = `${process.env.ENTERPRISE_BASE_URL}v1/banks/gh`
      txData = {}
    }

    // get rate
    let rateData
    if (destCurrency === 'ghs' && srcCurrency === 'cusd') {
      rateData = await RateModel.findOne({
        name: 'ghsCusdSellRate',
        ticker: newCurrencyPair
      })
        .select('-_id')
        .lean()
    } else if (destCurrency === 'ngn' && srcCurrency === 'cusd') {
      rateData = await RateModel.findOne({
        name: 'ngnCusdSellRate',
        ticker: newCurrencyPair
      })
        .select('-_id')
        .lean()
    } else if (destCurrency === 'ghs' && srcCurrency === 'celo') {
      rateData = await RateModel.findOne({
        name: 'ghsCeloSellRate',
        ticker: newCurrencyPair
      })
        .select('-_id')
        .lean()
    } else if (destCurrency === 'ngn' && srcCurrency === 'celo') {
      console.log('-------hit here oh------')
      rateData = await RateModel.findOne({
        name: 'ngnCeloSellRate',
        ticker: newCurrencyPair
      })
        .select('-_id')
        .lean()
    } else {
      throw new Error(
        'Source currency or destination currency is not supported'
      )
    }
    const percentageFee = await Fee.findOne({ name: 'percentagefee' })
    const rate = rateData.rate
    let destAmount = srcAmount * rate
    const txFee = percentageFee.amount / 100
    const txCharge = txFee * destAmount
    updatedDestAmount = destAmount - txCharge

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
    return res.status(201).json({ rateData })
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

module.exports = { createTransaction, createWithdrawalTransaction }
