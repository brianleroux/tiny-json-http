var test = require('tape')
var fs = require('fs')
var path = require('path')
var tiny = require('./dist.js')
var http = require('http')
var server

test('make a multipart post', t=> {
  t.plan(1)
  t.ok(tiny, 'got env')
})

test('start a fake server', t=> {
  t.plan(1)
  // somebody thought this was intuitive
  server = http.createServer((req, res)=> {
    var body = []
    req.on('data', function _data(data) {
      //console.log(data.toString())
      body.push(data)
    })
    req.on('end', function _end() {
      console.log('END', Buffer.concat(body).toString())
    })
    res.end('ugh')
  }).listen(3000, x=> {
    t.ok(true, 'opened server')
  })
})

test('can multipart/form-data post', t=> {
  t.plan(1)
  tiny.post({
    url: 'http://localhost:3000',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: {
      one: 1,
      anotherFile: fs.createReadStream(path.join(__dirname, 'readme.md'))
    }
  },
  function _post(err, data) {
    if (err) {
      t.fail(err, err)
      console.log(err)
    }
    else {
      t.ok(true, 'posted')
      console.log(data)
    }
  })
})

test('close fake server', t=> {
  t.plan(1)
  server.close()
  t.ok(true, 'server closed')
})
