var util = require('util')
var _read = require('./_read')
var _write = require('./_write')

module.exports = {
  get: util.promisify(_read),
  post: util.promisify(_write.bind({}, 'POST')),
  put: util.promisify(_write.bind({}, 'PUT')),
  del: util.promisify(_write.bind({}, 'DELETE')),
}
