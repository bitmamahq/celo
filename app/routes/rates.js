const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/auth')

const { getRates } = require('../controllers/rates')

/*
 * Get rates route
 */
router.get('/', trimRequest.all, getRates)

module.exports = router
