const Transaction = require('../../models/transaction')
const { matchedData } = require('express-validator')
const { isIDGood, handleError } = require('../../middleware/utils')
const { getItem } = require('../../middleware/db')

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getTransaction = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await isIDGood(req.id)
    res.status(200).json(await getItem(id, Transaction))
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getTransaction }
