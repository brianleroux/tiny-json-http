var test = require('tape')
var tiny = require('./')
var http = require('http')
var server
let body = ''

test('startup', t=> {
  t.plan(1)
  server = http.createServer((req, res) => {
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        body: body.concat(),
        gotPost:true,
        ok:true
      }))
    })
  })
  server.listen(3000)
  t.pass('started server')
})

test('supports form-urlencoded bodies', t=> {
  t.plan(3)
  var url = 'http://localhost:3000'
  var data = { foo: 'bar', this: 'is form url encoded!' }
  var headers = { 'content-type': 'application/x-www-form-urlencoded' }
  tiny.post({url, data, headers}, function __posted(err, result) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(result, 'got a result')
      t.ok(result.body.gotPost, 'got a post')
      t.equal(result.body.body, 'foo=bar&this=is%20form%20url%20encoded!', 'got form-urlencoded response')
      console.log(result)
    }
  })
})

test('shutdown', t=> {
  t.plan(1)
  server.close()
  t.ok(true, 'closed server')
})
