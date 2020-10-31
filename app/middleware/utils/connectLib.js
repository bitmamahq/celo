const axiosLib = require('./axiosLib')
const { handleError } = require('./handleError')
const { buildErrObject } = require('./buildErrObject')

module.exports = (() => {
  let funcs = {}

  /**
   * Get List of all Banks
   * @returns {Promise<unknown>}
   */
  funcs.listBanks = async () => {
    try {
      let url = `${process.env.CONNECT_API_ENDPOINT}/banks`
      let authString = `${process.env.CONNECT_USERNAME}:${process.env.CONNECT_PASSWORD}`
      let authToken = Buffer.from(authString).toString('base64')

      let headers = {
        Authorization: `Basic ${authToken}`,
        OrganizationID: process.env.CONNECT_ORGANIZATION_ID,
        'Content-Type': 'application/json'
      }
      let req = await axiosLib.get(url, headers)
      return Promise.resolve(req.data)
    } catch (err) {
      console.log('ERROR IN connect list banks', err)
      return Promise.reject(err)
    }
  }

  funcs.resolveAccountNumber = async (accountNumber, bankCode) => {
    try {
      let url = `${process.env.CONNECT_API_ENDPOINT}/banks/resolve-account`
      let authString = `${process.env.CONNECT_USERNAME}:${process.env.CONNECT_PASSWORD}`
      let authToken = Buffer.from(authString).toString('base64')

      let headers = {
        Authorization: `Basic ${authToken}`,
        OrganizationID: process.env.CONNECT_ORGANIZATION_ID,
        'Content-Type': 'application/json'
      }

      let data = {
        bankCode,
        accountNumber
      }

      let resolve = await axiosLib.post(url, data, headers)
      return Promise.resolve(resolve.data)
    } catch (err) {
      console.log('ERROR IN connect list banks', err)
      return Promise.reject(err)
    }
  }

  return funcs
})()
