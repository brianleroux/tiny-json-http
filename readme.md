# tiny-json-http

Minimalist `HTTP` client for `GET` and `POST`ing `JSON` payloads

- Zero dependencies: perfect for AWS Lambda
- Sane default: assumes buffered JSON responses
- System symmetry: Node style errback API

```bash
npm i tiny-json-http --save
```

### api

- `tiny.get(options, callback)`
- `tiny.post(options, callback)`

### options

- `url` *required*
- `data` only used by `http.post`
- `headers` key/value map used for headers
