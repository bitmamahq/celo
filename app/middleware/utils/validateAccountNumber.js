const { resolveAccountNumber } = require('../../middleware/utils/connectLib')
const { buildErrObject } = require('./buildErrObject')

/**
 *
 * @param bankCode
 * @returns {Promise<unknown>}
 */
const validateAccount = async (bankCode = '', accountNumber) => {
  try {
    let resolved = await resolveAccountNumber(accountNumber, bankCode)
    if (resolved.statusCode >= 400) {
      return Promise.reject(buildErrObject(422, 'ACCOUNT_NUMBER_MISMATCH'))
    }

    return Promise.resolve(resolved.data)
  } catch (error) {
    return Promise.reject(buildErrObject(422, 'INVALID_BANKCODE'))
  }
}

module.exports = { validateAccount }
