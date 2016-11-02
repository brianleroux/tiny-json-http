var http = require('http')
var https = require('https')
var url = require('url')
var qs = require('querystring')

module.exports = function _read(options, callback) {

  // require options.url or fail noisily 
  if (!options.url) {
    throw Error('options.url required')
  }

  // parse out the options from options.url
  var opts = url.parse(options.url)

  // check for additional query params
  if (options.data) {
    var isSearch = !!opts.search
    options.url += (isSearch? '&' : '?') + qs.stringify(options.data)
    opts = url.parse(options.url)
  }

  var method = opts.protocol === 'https:'? https.get : http.get

  opts.rejectUnauthorized = false
  opts.agent = false
  opts.headers = options.headers || {}
  opts.headers['User-Agent'] = opts.headers['User-Agent'] || 'tiny-http'
  opts.headers['Content-Type'] = opts.headers['Content-Type'] || 'application/json'
  
  // make a request
  method(opts, function __res(res) {
   
    var rawData = ''
    var statusCode = res.statusCode
    var contentType = res.headers['content-type']
    var isJSON = contentType.startsWith('application/json')

    var ok = statusCode >= 200 && statusCode < 300
    if (!ok) {
      callback(Error('GET failed with: ' + statusCode))
      res.resume()
      return
    }
 
    res.setEncoding('utf8')
    res.on('data', function(chunk) {rawData += chunk})
    res.on('end', function(x) {
      try {
        var parsedData = isJSON? JSON.parse(rawData) : rawData
        callback(null, parsedData)
      } 
      catch (e) {
        callback(e)
      }
    })
  }).on('error', function(e) { callback(Error(e.message)) } )
}
