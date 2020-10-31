const { listBanks } = require('../../middleware/utils/connectLib')
const { buildErrObject } = require('./buildErrObject')

/**
 *
 * @param bankCode
 * @returns {Promise<unknown>}
 */
const validateBankCode = async (bankCode = '') => {
  try {
    let banks = await listBanks()
    let bankArr = banks.data
    let checkBank = bankArr.filter((item) => item.bankCode === bankCode)
    if (!checkBank.length) {
      return Promise.reject(buildErrObject(422, 'INVALID_BANKCODE'))
    }

    return Promise.resolve(checkBank[0])
  } catch (error) {
    return Promise.reject(buildErrObject(422, 'INVALID_BANKCODE'))
  }
}

module.exports = { validateBankCode }
