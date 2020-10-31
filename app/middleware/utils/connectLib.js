const axiosLib = require('./axiosLib')
const { handleError } = require('./handleError')
const { buildErrObject } = require('./buildErrObject')

module.exports = (() => {
  let funcs = {}

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
      return Promise.reject(err)
    }
  }

  /**
   * To create a virtual account for a user
   * @param {Object} param - Parameters for the transfer
   * @param {String} param.name - Name of the user
   * @param {String} param.email - Email of the user
   * @param {String} param.phone - Phone Number of the user
   * @param {String} param.accountName - Name that will be used on the bank account
   * @returns {Promise<void>}
   */
  funcs.createAccount = async (param) => {
    try {
      let url = `${config.CONNECT_API_ENDPOINT}/accounts`
      let authString = `${config.CONNECT_USERNAME}:${config.CONNECT_PASSWORD}`
      let authToken = Buffer.from(authString).toString('base64')

      let headers = {
        Authorization: `Bearer ${authToken}`,
        OrganizationID: config.CONNECT_ORGANIZATION_ID,
        'Content-Type': 'application/json'
      }

      let body = {
        customer: {
          name: param.name,
          email: param.email,
          phoneNumber: param.phone,
          sendNotifications: true
        },
        type: 'RESERVED',
        accountName: param.accountName,
        bankCode: '000001',
        currency: 'NGN',
        country: 'NG'
      }

      let request = await axiosLib.post(url, body, headers)
      return Promise.resolve(request)
    } catch (err) {
      console.log('Error in CONNECT::Create::Account ', err)
      return Promise.reject(err)
    }
  }

  return funcs
})()
