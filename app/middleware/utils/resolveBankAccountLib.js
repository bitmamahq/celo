const axiosLib = require('./axiosLib')
module.exports = (() => {
  const funcs = {} // resolve account

  /**
   * GET call from axios
   * @param endpoint
   * @param headers
   * @returns {Promise<{data: any, status: number}>}
   */ funcs.resolveBankaccount = async (
    countryCode,
    bankAccountNumber,
    bankCode,
    bankName,
    bankAccountName
  ) => {
    try {
      let txData
      // either ngn or gh
      if (countryCode === 'ngn') {
        const axiosBody = {
          accountNumber: bankAccountNumber,
          bankCode
        }
        const axiosHeaders = {
          'Content-Type': 'application/json',
          token: process.env.ENTERPRISE_TOKEN
        }
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
        return Promise.resolve({ ...txData })
      } else {
        // const ghBanksEndpoint = `${process.env.ENTERPRISE_BASE_URL}v1/banks/gh`
        txData = {
          'bankDetails.bankName': bankName,
          'bankDetails.bankCode': bankCode,
          'bankDetails.bankAccountNumber': bankAccountNumber,
          'bankDetails.bankAccountName': bankAccountName
        }
        return Promise.resolve({ ...txData })
      }
    } catch (err) {
      console.error('Error in AXIOS get: ', err)
      return Promise.reject(err.response.data)
    }
  }

  return funcs
})()
