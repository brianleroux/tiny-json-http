var qs = require('querystring')
var http = require('http')
var https = require('https')
var url = require('url')

module.exports = function _write(httpMethod, options, callback) {

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
  var method = opts.protocol === 'https:'? https.request : http.request
  var defaultContentType = 'application/json; charset=utf-8'

  // put the params on the query as well as the body?
  if (httpMethod === 'DELETE' && options.data) {
    var isSearch = !!opts.search
    options.url += (isSearch? '&' : '?') + qs.stringify(options.data)
    opts = url.parse(options.url)
  }

  opts.method = httpMethod
  opts.rejectUnauthorized = false
  opts.headers = options.headers || {}
  opts.headers['User-Agent'] = opts.headers['User-Agent'] || 'tiny-http'
  opts.headers['Content-Type'] = opts.headers['Content-Type'] || defaultContentType
  var reqJSON = opts.headers['Content-Type'].startsWith('application/json')
  var postData = reqJSON? JSON.stringify(options.data || {}) : qs.stringify(options.data || {})
  opts.headers['Content-Length'] = postData.length

  // make a POST request
  var req = method(opts, function(res) {
    var raw = [] // keep our buffers here
    var ok = res.statusCode >= 200 && res.statusCode < 300

    res.on('data', function __data(chunk) {
      raw.push(chunk)
    })

    res.on('end', function __end() {
      var err = null
      var result = null

      try {
        var isJSON = res.headers['content-type'].startsWith('application/json')
        result = Buffer.concat(raw)

        if (!options.buffer) {
          result = isJSON ? JSON.parse(result.toString()) : result.toString()
        }
      }
      catch (e) {
        err = e
      }

      if (!ok) {
        err = Error(httpMethod + ' failed with: ' + res.statusCode)
        err.raw = res
        err.body = result
        callback(err)
      } else {
        callback(err, {body:result, headers:res.headers})
      }
    })
  })

  req.on('error', callback)

  req.write(postData)

  req.end()

  return promise
}
