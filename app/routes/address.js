const express = require('express')
const router = express.Router()
// const trimRequest = require('trim-request')
// const passport = require('passport')
// const requireAuth = passport.authenticate('jwt', {
//   session: false
// })
// const {
//   roleAuthorization
// } = require('../controllers/auth')

const {
  createAddress
  // getAddresses
} = require('../controllers/address/index')
const { validateCreateAddress } = require('../controllers/address/validators')

/*
 * Create address route
 */
// router.post("/", async(req, res) => {
//     res.json("Hllo world")
// })
// router.post('/',  requireAuth,roleAuthorization(['user', 'admin']),validateCreateAddress, createAddress)
router.post('/', validateCreateAddress, createAddress)
/*
 * Get address route
 */
// trimRequest.all,
// router.get('/',  getAddresses)

module.exports = router
