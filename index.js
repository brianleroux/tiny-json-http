var http = require('http')
var https = require('https')
var url = require('url')

function exec(httpMethod, options, callback) {

  // require options.url or fail noisily 
  if (!options.url) {
    throw Error('options.url required')
  }

  // parse out the options from options.url
  var opts = url.parse(options.url)
  var method = opts.protocol === 'https:'? https.get : http.get

  // ignore warnings about dns 
  opts.rejectUnauthorized = false
  opts.agent = false
  opts.timeout = 3000
  opts.headers = options.headers || {}
  
  if (httpMethod === 'POST') {
    method = opts.protocol === 'https:'? https.request : http.request
    opts.method = 'POST'
    opts.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  
  // set a User-Agent (Github requires this for example)
  if (!opts.headers['User-Agent']) {
    opts.headers['User-Agent'] = 'tiny-http'
  }

  // if json and no Content-Type set then use application/json 
  if (options.json && typeof opts.headers['Content-Type'] === 'undefined') {
    opts.headers['Content-Type'] === 'application/json'
  }

  console.log(opts)

  // make a request
  method(opts, res=> {
   
    var rawData = ''
    var statusCode = res.statusCode
    // var contentType = res.headers['content-type']

    if (statusCode !== 200) {
      callback(Error(`GET failed with: ${statusCode}`))
      res.resume()
      return
    }
 
    res.setEncoding('utf8')
    res.on('data', chunk=> rawData += chunk)
    res.on('end', x=> {
      try {
        var parsedData = options.json? JSON.parse(rawData) : rawData
        callback(null, parsedData)
      } 
      catch (e) {
        callback(e.message)
      }
    })
  }).on('error', e=> callback(Error(e.message)))
}

// - opts: url
module.exports = {

  get(options, callback) {
    exec('GET', options, callback)
  },

  post(options, callback) {
    exec('POST', options, callback)
  }
}
