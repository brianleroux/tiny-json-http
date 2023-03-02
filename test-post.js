var test = require('tape')
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var tiny = require('./dist.js')
var server

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.post('/', (req, res)=> {
  res.json(Object.assign(req.body, {gotPost:true, ok:true}))
})

app.post('/void', (req, res)=> {
  res.json('')
})

app.put('/', (req, res)=> {
  res.json(Object.assign(req.body, {gotPut:true, ok:true}))
})

app.patch('/', (req, res)=> {
  res.json(Object.assign(req.body, {gotPatch:true, ok:true}))
})

app.delete('/', (req, res)=> {
  res.json(Object.assign(req.body, {gotDel:true, ok:true}))
})

app.post('/goaway', (req, res) => {
  res.setHeader('location', '/')
  res.statusCode = 302
  res.send()
})

app.post('/boom', (req, res)=> {
  res.setHeader('test-header', 'foo')
  res.statusCode = 400
  res.json({calls:3})
})

test('startup', t=> {
  t.plan(1)
  server = app.listen(3000, x=> {
    t.ok(true, 'started server')
  })
})

test('can post', t=> {
  t.plan(2)
  var url = 'http://localhost:3000/'
  var data = {a:1, b:new Date(Date.now()).toISOString()}
  tiny.post({url, data}, function __posted(err, result) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(result, 'got a result')
      t.ok(result.body.gotPost, 'got a post')
      console.log(result)
    }
  })
})

test('can post and handle "no content"', t=> {
  t.plan(2)
  var url = 'http://localhost:3000/void'
  var data = {a:1, b:new Date(Date.now()).toISOString()}
  tiny.post({url, data}, function __posted(err, result) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(result, 'got a result (empty tho)')
      t.is(result.body, '')
      console.log(result)
    }
  })
})

test('can put', t=> {
  t.plan(2)
  var url = 'http://localhost:3000/'
  var data = {a:1, b:new Date(Date.now()).toISOString()}
  tiny.put({url, data}, function __posted(err, result) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(result, 'got a result')
      t.ok(result.body.gotPut, 'got a put')
      console.log(result)
    }
  })
})

test('can patch', t=> {
  t.plan(2)
  var url = 'http://localhost:3000/'
  var data = {a:1, b:new Date(Date.now()).toISOString()}
  tiny.patch({url, data}, function __posted(err, result) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(result, 'got a result')
      t.ok(result.body.gotPatch, 'got a patch')
      console.log(result)
    }
  })
})

test('can del', t=> {
  t.plan(3)
  var url = 'http://localhost:3000/'
  var data = {a:1, b:new Date(Date.now()).toISOString()}
  tiny.del({url, data}, function __posted(err, result) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(result, 'got a result')
      t.ok(result.body.gotDel, 'got a del')
      t.ok(result.body.a, 'passed params via query I guess')
      console.log(result)
    }
  })
})

test('can delete (aliased to del)', t=> {
  t.plan(3)
  var url = 'http://localhost:3000/'
  var data = {a:1, b:new Date(Date.now()).toISOString()}
  tiny.delete({url, data}, function __posted(err, result) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(result, 'got a result')
      t.ok(result.body.gotDel, 'got a del')
      t.ok(result.body.a, 'passed params via query I guess')
      console.log(result)
    }
  })
})

test('can access response on errors', t=> {
  t.plan(5)
  var url = 'http://localhost:3000/boom'
  var data = {};
  tiny.post({url, data}, function __posted(err, result) {
    t.ok(err, 'got an error')
    t.ok(err.raw, 'has raw response')
    t.equal(err.raw.statusCode, 400)
    t.equal(err.raw.headers['test-header'], 'foo')
    t.deepEqual(err.body, {calls: 3})
  })
})

test('can handle redirects', t=> {
  t.plan(2)
  var url = 'http://localhost:3000/goaway'
  var data = {}
  tiny.post({url, data}, function __posted(err, result) {
    if (err) {
      t.fail(err)
      t.end()
    } else {
      t.ok(result, 'got a result')
      t.ok(result.headers.location, 'got a location header')
      console.log(result)
    }
  })
})

test('shutdown', t=> {
  t.plan(1)
  server.close()
  t.ok(true, 'closed server')
})
