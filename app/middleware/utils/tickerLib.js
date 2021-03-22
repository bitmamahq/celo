module.exports = (() => {
  const funcs = {}

  /**
   * GET call from axios
   * @param endpoint
   * @param headers
   * @returns {Promise<{data: any, status: number}>}
   */
  funcs.getTicker = async (fiatCurrency, cryptoCurrency) => {
    try {
      let ticker
      if (cryptoCurrency === 'cusd') {
        ticker = `usd${fiatCurrency}`
      } else {
        ticker = `${cryptoCurrency}${fiatCurrency}`
      }
      return Promise.resolve(ticker)
    } catch (err) {
      console.error('Error in AXIOS get: ', err.response.data)
      return Promise.reject(err.response.data)
    }
  }

  return funcs
})()
