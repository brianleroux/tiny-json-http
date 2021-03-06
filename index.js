var _read = require('./_read')
var _write = require('./_write')

module.exports = {
  get: _read.bind({}, 'GET'),
  head: _read.bind({}, 'HEAD'),
  options: _read.bind({}, 'OPTIONS'),
  post: _write.bind({}, 'POST'),
  put: _write.bind({}, 'PUT'),
  patch: _write.bind({}, 'PATCH'),
  del: _write.bind({}, 'DELETE'),
  delete: _write.bind({}, 'DELETE'),
}
