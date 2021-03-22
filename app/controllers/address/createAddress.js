const { handleError } = require('../../middleware/utils')
const axiosLib = require('../../middleware/utils/axiosLib')
const Address = require('../../models/Address')
/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createAddress = async (req, res) => {
  try {
    const { coin } = req.body
    // const user = req.user
    const label = `CELO LABEL`
    const body = {
      coin,
      label
    }
    const headers = {
      'Content-Type': 'application/json',
      token: process.env.ENTERPRISE_TOKEN
    }
    const endpoint = `${process.env.ENTERPRISE_BASE_URL}v1/address`
    const addr = await axiosLib.post(endpoint, body, headers)
    const saveAddr = new Address({
      coin: addr.data.message.coin,
      label: addr.data.message.label
    })
    await saveAddr.save() // save db
    return res.status(200).json({ address: saveAddr })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = createAddress
