# tiny-json-http

Minimalist `HTTP` client for `GET` and `POST`ing `JSON` payloads

- Zero dependencies: perfect for AWS Lambda
- Sensible default: assumes buffered JSON responses
- System symmetry: Node style errback API, or Promises for use with Async/Await

```bash
npm i tiny-json-http --save
```

### api

- `tiny.get(options[, callback])`
- `tiny.post(options[, callback])`
- `tiny.put(options[, callback])`
- `tiny.del(options[, callback)]`

_*callback is optional, tiny methods will return a promise if no callback is provided_

### options

- `url` *required*
- `data` form vars for `tiny.post`, `tiny.put`, and `tiny.delete` otherwise querystring vars for `tiny.get`
- `headers` key/value map used for headers (including support for uploading files with `multipart/form-data`)
- `buffer` if set to `true` the response body is returned as a buffer

### callback values

- `err` a real javascript `Error` if there was one
- `data` an object with `headers` and `body` keys

### promises

- if no `callback` is provided to the tiny-json-http methods, a promise is returned
- perfect for use of async/await

## examples

#### With Async / Await

```javascript
var tiny = require('tiny-json-http')
var url = 'http://www.randomkittengenerator.com'

;(async function _iife() {
  try {
    console.log(await tiny.get({url}))
  } catch (err) {
    console.log('ruh roh!', err)
  }
})();
```

#### With Callback

```javascript
var tiny = require('tiny-json-http')
var url = 'http://www.randomkittengenerator.com'

tiny.get({url}, function _get(err, result) {
  if (err) {
    console.log('ruh roh!', err)
  }
  else {
    console.log(result)
  }
})
```

Check out the tests for more examples! :heart_decoration:
