const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/auth')

const { createTransaction } = require('../controllers/transactions')

/*
 * Get rates route
 */
router.post('/', trimRequest.all, createTransaction)
module.exports = router
