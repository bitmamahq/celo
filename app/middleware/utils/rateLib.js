const RateModel = require('../../models/rate')
module.exports = (() => {
  const funcs = {} // resolve account

  /**
   * GET call from axios
   * @param endpoint
   * @param headers
   * @returns {Promise<{data: any, status: number}>}
   */
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
        rateData = await RateModel.findOne({
          name: 'ghsCeloSellRate',
          ticker
        })
          .select('-_id')
          .lean()
      } else if (destCurrency === 'ngn' && srcCurrency === 'celo') {
        console.log('-------hit here oh------')
        rateData = await RateModel.findOne({
          name: 'ngnCeloSellRate',
          ticker
        })
          .select('-_id')
          .lean()
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
        rateData = await RateModel.findOne({
          name: 'ghsCeloBuyRate',
          ticker
        })
          .select('-_id')
          .lean()
      } else if (srcCurrency === 'ngn' && destCurrency === 'celo') {
        rateData = await RateModel.findOne({
          name: 'ngnCeloBuyRate',
          ticker
        })
          .select('-_id')
          .lean()
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
