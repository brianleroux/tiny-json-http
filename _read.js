var http = require('http')
var https = require('https')
var url = require('url')
var qs = require('querystring')

module.exports = function _read(options, callback) {

  // require options.url or fail noisily
  if (!options.url) {
    throw Error('options.url required')
  }

  // setup promise if there is no callback
  var promise
  if (!callback) {
    promise = new Promise(function(res, rej) {
      callback = function(err, result) {
        err ? rej(err) : res(result)
      }
    })
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

  opts.headers = options.headers || {}
  opts.headers['User-Agent'] = opts.headers['User-Agent'] || 'tiny-http'
  opts.headers['Content-Type'] = opts.headers['Content-Type'] || 'application/json'

  // make a request
  var req = method(opts, function _res(res) {

    var raw = []

    res.on('data', function _data(chunk) {
      raw.push(chunk)
    })

    res.on('end', function _end() {
      var err = null
      var result = null
      try {
        var isJSON = res.headers['content-type'].startsWith('application/json')
        result = Buffer.concat(raw)

        if (!options.buffer) {
          var strRes = result.toString()
          result = strRes && isJSON ? JSON.parse(strRes) : strRes
        }
      }
      catch (e) {
        err = e
      }
      callback(err, {body:result, headers:res.headers})
    })

    var ok = res.statusCode >= 200 && res.statusCode < 300
    if (!ok) {
      let err = Error('GET failed with: ' + res.statusCode)
      err.raw = res
      err.body = Buffer.concat(raw).toString()
      err.statusCode = res.statusCode
      callback(err)
      res.resume()
      return
    }
  })

  req.on('error', callback)
  return promise
}
