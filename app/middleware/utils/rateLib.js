const RateModel = require('../../models/rate')
const axiosLib = require('./axiosLib')

module.exports = (() => {
  const funcs = {} // resolve account

  /**
   * GET call from axios
   * @param endpoint
   * @param headers
   * @returns {Promise<{data: any, status: number}>}
   */
  /* eslint-disable */
  funcs.getSellRateData = async (destCurrency, srcCurrency, ticker) => {
    try {
      let rateData
      if (destCurrency === 'ghs' && srcCurrency === 'cusd') {
        rateData = await RateModel.findOne({
          name: 'ghsCusdSellRate',
          ticker
        })
          .select('-_id')
          .lean()
      } else if (destCurrency === 'ngn' && srcCurrency === 'cusd') {
        rateData = await RateModel.findOne({
          name: 'ngnCusdSellRate',
          ticker
        })
          .select('-_id')
          .lean()
      } else if (destCurrency === 'ghs' && srcCurrency === 'celo') {
        const axiosHeaders = {
          'Content-Type': 'application/json',
          token: process.env.ENTERPRISE_TOKEN
        }
        const endpoint = `${process.env.ENTERPRISE_BASE_URL}/v1/rate?ticker=celoghs`
        rateData = await axiosLib.get(endpoint, axiosHeaders)
        rateData = {
          rate: rateData.data.message.sell
        }
      } else if (destCurrency === 'ngn' && srcCurrency === 'celo') {
        const axiosHeaders = {
          'Content-Type': 'application/json',
          token: process.env.ENTERPRISE_TOKEN
        }
        const endpoint = `${process.env.ENTERPRISE_BASE_URL}v1/rate?ticker=celongn`
        rateData = await axiosLib.get(endpoint, axiosHeaders)
        rateData = {
          rate: rateData.data.message.sell
        }
      } else {
        throw new Error(
          'Source currency or destination currency is not supported'
        )
      }
      return Promise.resolve(rateData)
    } catch (err) {
      return Promise.reject(err)
    }
  }
  /* eslint-disable */
  funcs.getBuyRateData = async (srcCurrency, destCurrency, ticker) => {
    try {
      let rateData
      if (srcCurrency === 'ghs' && destCurrency === 'cusd') {
        rateData = await RateModel.findOne({
          name: 'ghsCusdBuyRate',
          ticker
        })
          .select('-_id')
          .lean()
      } else if (srcCurrency === 'ngn' && destCurrency === 'cusd') {
        rateData = await RateModel.findOne({
          name: 'ngnCusdBuyRate',
          ticker
        })
          .select('-_id')
          .lean()
      } else if (srcCurrency === 'ghs' && destCurrency === 'celo') {
        const axiosHeaders = {
          'Content-Type': 'application/json',
          token: process.env.ENTERPRISE_TOKEN
        }
        const endpoint = `${process.env.ENTERPRISE_BASE_URL}v1/rate?ticker=celoghs`
        rateData = await axiosLib.get(endpoint, axiosHeaders)
        rateData = {
          rate: rateData.data.message.buy
        }
      } else if (srcCurrency === 'ngn' && destCurrency === 'celo') {
        const axiosHeaders = {
          'Content-Type': 'application/json',
          token: process.env.ENTERPRISE_TOKEN
        }
        const endpoint = `${process.env.ENTERPRISE_BASE_URL}v1/rate?ticker=celongn`
        rateData = await axiosLib.get(endpoint, axiosHeaders)
        rateData = {
          rate: rateData.data.message.buy
        }
      } else {
        throw new Error(
          'Source currency or destination currency is not supported'
        )
      }
      return Promise.resolve(rateData)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  return funcs
})()
