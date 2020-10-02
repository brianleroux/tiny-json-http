# tiny-json-http

Minimalist `HTTP` client for `GET`, `POST`, `PUT`, `PATCH` and `DELETE` `JSON` payloads

- Zero dependencies: perfect for AWS Lambda
- Sensible default: assumes buffered JSON responses
- System symmetry: Node style errback API, or Promises for use with Async/Await

```bash
npm i tiny-json-http --save
```

### API

#### Read methods
- `tiny.get(options[, callback])`
- `tiny.head(options[, callback])`
- `tiny.options(options[, callback])`

#### Write methods
- `tiny.post(options[, callback])`
- `tiny.put(options[, callback])`
- `tiny.patch(options[, callback])`
- `tiny.del(options[, callback)]`

_*callback is optional, tiny methods will return a promise if no callback is provided_

### Options

- `url` *required*
- `data` form vars for `tiny.post`, `tiny.put`, `tiny.patch`, and `tiny.delete` otherwise querystring vars for `tiny.get`
- `headers` key/value map used for headers (including support for uploading files with `multipart/form-data`)
- `buffer` if set to `true` the response body is returned as a buffer

### Callback values

- `err` a real javascript `Error` if there was one
- `data` an object with `headers` and `body` keys

### Promises

- if no `callback` is provided to the tiny-json-http methods, a promise is returned
- perfect for use of async/await

## Examples

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
