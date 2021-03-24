const { handleError } = require('../../middleware/utils')
const axiosLib = require('../../middleware/utils/axiosLib')

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getCeloRate = async (req, res) => {
  try {
    const pair = req.params.pair
    const pairs = ['celoghs', 'celongn']

    if (!pairs.includes(pair)) {
      throw new Error('Peer not valid')
    }
    const axiosHeaders = {
      'Content-Type': 'application/json',
      token: process.env.ENTERPRISE_TOKEN
    }
    const endpoint = `${process.env.ENTERPRISE_BASE_URL}v1/rate?ticker=${pair}`
    const getRate = await axiosLib.get(endpoint, axiosHeaders)

    res.status(200).json({ ...getRate })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getCeloRate }
