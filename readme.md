# tiny-json-http

Minimalist `HTTP` client for `GET` and `POST`ing `JSON` payloads

- Zero dependencies: perfect for AWS Lambda or Browserify
- Sane default: assumes buffered JSON responses
- System symmetry: Node style errback API

```bash
npm i tiny-json-http --save
```

### api

- `tiny.get(options, callback)`
- `tiny.post(options, callback)`
- `tiny.put(options, callback)`
- `tiny.del(options, callback)`

### options

- `url` *required*
- `data` form vars for `tiny.post`, `tiny.put`, and `tiny.delete` otherwise querystring vars for `tiny.get`
- `headers` key/value map used for headers

Check out the tests for examples! :heart_decoration:
