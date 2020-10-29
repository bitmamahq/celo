const Rate = require('../../models/rate')
const { handleError } = require('../../middleware/utils')

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getRate = async (req, res) => {
  try {
    let peer = req.params.peer
    const peers = ['usdngn', 'eurngn', 'ghcngn']

    if (!peers.includes(peer)) {
      throw new Error('Peer not valid')
    }

    let query = await Rate.findOne({ name: peer }).select('-_id').lean()

    if (!query) {
      throw new Error('Record not in DB')
    }

    res.status(200).json({ msg: query })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getRate }
