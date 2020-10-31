/**
 * Builds error object
 * @param {number} code - error code
 * @param {string} message - error text
 */
const buildErrObject = (code = 400, message = '') => {
  return {
    code,
    message
  }
}

module.exports = { buildErrObject }
