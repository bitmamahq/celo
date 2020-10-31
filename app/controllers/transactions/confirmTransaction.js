const Transaction = require('../../models/transaction')
const { matchedData } = require('express-validator')
const { isIDGood, handleError } = require('../../middleware/utils')
const { updateItem, getItem } = require('../../middleware/db')

/**
 * Confirm transaction function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const confirmTransaction = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await isIDGood(req.id)
    let tx = await getItem(id, Transaction)
    if (tx.status === 'processing') throw new Error('IN_PROCESS')

    res
      .status(200)
      .json(await updateItem(id, Transaction, { status: 'processing' }))
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { confirmTransaction }
