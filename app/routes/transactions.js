const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/auth')

const {
  createTransaction,
  getTransaction,
  confirmTransaction
} = require('../controllers/transactions')
const {
  validateGetTransaction
} = require('../controllers/transactions/validators')

/*
 * Get rates route
 */
router.post('/', trimRequest.all, createTransaction)
router.get('/:id', trimRequest.all, validateGetTransaction, getTransaction)
router.get(
  '/confirm/:id',
  trimRequest.all,
  validateGetTransaction,
  confirmTransaction
)
module.exports = router
