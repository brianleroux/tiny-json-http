let test = require('tape')
let fs = require('fs')
let path = require('path')
let tiny = require('./dist.js')
let http = require('http')
let port = 3000
let host = 'localhost'
let server

test('make a multipart post', t=> {
  t.plan(1)
  t.ok(tiny, 'got env')
})

test('start a fake server', t=> {
  t.plan(1)
  // somebody thought this was intuitive
  server = http.createServer((req, res)=> {
    let body = []
    req.on('data', chunk => body.push(chunk))
    req.on('end', function _end() {
      body = Buffer.concat(body).toString()
      res.end(body)
    })
  })
  server.listen({port, host}, err=> {
    if (err) t.fail(err)
    else t.pass(`Started server`)
  })
})

test('can multipart/form-data post', t=> {
  t.plan(1)
  let file = fs.readFileSync(path.join(__dirname, 'readme.md'))
  tiny.post({
    url: `http://${host}:${port}`,
    headers: {
      'content-type': 'multipart/form-data'
    },
    data: {
      one: 1,
      file
    }
  },
  function _post(err, data) {
    if (err) {
      t.fail(err, err)
      console.log(err)
    }
    else {
      t.ok(data.body.includes(file.toString()), 'posted')
      console.log(data)
    }
  })
})

test('close fake server', t=> {
  t.plan(1)
  server.close()
  t.ok(true, 'server closed')
})
