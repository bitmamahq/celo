const axios = require('axios')

module.exports = (() => {
  const funcs = {}

  /**
   * GET call from axios
   * @param endpoint
   * @param headers
   * @returns {Promise<{data: any, status: number}>}
   */
  funcs.get = async (endpoint, headers = {}) => {
    try {
      let config = {
        method: 'get',
        url: endpoint,
        headers
      }

      let req = await axios(config)
      return Promise.resolve({ status: req.status, data: req.data })
    } catch (err) {
      console.error('Error in AXIOS get: ', err.response.data)
      return Promise.reject(err.response.data)
    }
  }

  /**
   * POST call for AXIOS
   * @param endpoint
   * @param body
   * @param headers
   * @returns {Promise<{data: any, status: number}>}
   */
  funcs.post = async (endpoint, body, headers = {}) => {
    try {
      let config = {
        method: 'post',
        url: endpoint,
        headers,
        data: body
      }

      let req = await axios(config)
      return Promise.resolve({ status: req.status, data: req.data })
    } catch (err) {
      console.error('Error in AXIOS post: ', err.message)
      return Promise.reject(err)
    }
  }

  /**
   * DELETE call for axios
   * @param endpoint
   * @param headers
   * @returns {Promise<{data: any, status: number}>}
   */
  funcs.delete = async (endpoint, headers = {}) => {
    try {
      let config = {
        method: 'delete',
        url: endpoint,
        headers
      }

      let req = await axios(config)
      return Promise.resolve({ status: req.status, data: req.data })
    } catch (err) {
      console.error('Error in AXIOS delete: ', err)
      return Promise.reject(err)
    }
  }

  return funcs
})()
