/**
 * Hack for mongoose-paginate, removes 'id' from results
 * @param {Object} result - result object
 * @param {Array} remove - List of items to remove from body
 */
const cleanPaginationID = (result = {}, remove = ['id']) => {
  result.docs.map((element) => {
    return remove.map((item) => delete element[item])
  })
  return result
}

module.exports = { cleanPaginationID }
