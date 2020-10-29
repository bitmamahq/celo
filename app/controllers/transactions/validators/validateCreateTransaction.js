const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
const validateCreateTransaction = [
  check('srcCurrency')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('destCurrency')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('srcAmount')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('destAmount')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('rate')
    .exists()
    .isNumeric()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('currencyPair')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('status')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('userId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateCreateTransaction }
