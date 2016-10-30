var http = require('http')
var https = require('https')
var url = require('url')

module.exports = function GET(options, callback) {

  // require options.url or fail noisily 
  if (!options.url) {
    throw Error('options.url required')
  }

  // parse out the options from options.url
  var opts = url.parse(options.url)
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

    if (statusCode !== 200) {
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
        callback(e.message)
      }
    })
  }).on('error', function(e) { callback(Error(e.message)) } )
}
