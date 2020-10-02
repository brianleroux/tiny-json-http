var test = require('tape')
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var tiny = require('./')
var server

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.get('/void', (req, res)=> {
  res.json('')
})

test('startup', t=> {
  t.plan(1)
  server = app.listen(3001, x=> {
    t.ok(true, 'started server')
  })
})

test('can get a url', t=> {
  t.plan(3)
  var url = 'https://brian.io'
  tiny.get({url}, function __got(err, result) {
    if (err) {
      t.fail(err.statusCode, 'failed to get')
    }
    else {
      t.ok(result, 'got a result')
      t.ok(result.headers, 'got headers')
      t.ok(result.body, 'got body')
      console.log(result)
    }
  })
})

test('can get json', t=> {
  t.plan(2)
  var url = 'https://api.github.com/'
  tiny.get({url}, function __json(err, result) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(result, 'got a result')
      t.equal(typeof result.body, 'object', 'body is an object')
      console.log(err, result)
    }
  })
})

test('can get and handle "no content"', t=> {
  t.plan(2)
  var url = 'http://localhost:3001/void'
  tiny.get({url}, function __void(err, result) {
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


test('get fails gracefully', t=> {
  t.plan(1)
  var url = 'http://nop333.ca'
  tiny.get({url}, function __ruhroh(err, result) {
    if (err) {
      t.ok(err, 'got err as expected')
      console.log(err)
    }
    else {
      t.fail(result, 'should not succeed')
    }
  })
})

test('can head a url', t=> {
  t.plan(2)
  var url = 'https://www.google.com'
  tiny.head({url}, function __got(err, result) {
    if (err) {
      t.fail(err.statusCode, 'failed to head')
    }
    else {
      t.ok(result, 'got a result')
      t.ok(result.headers, 'got headers')
      console.log(result)
    }
  })
})

test('can options a url', t=> {
  t.plan(2)
  var url = 'https://www.mozilla.org/en-US/'
  tiny.options({url}, function __got(err, result) {
    if (err) {alm
      t.fail(err.statusCode, 'failed to options')
    }
    else {
      t.ok(result, 'got a result')
      t.ok(result.headers, 'got headers')
      console.log(result)
    }
  })
})

test('shutdown', t=> {
  t.plan(1)
  server.close()
  t.ok(true, 'closed server')
})
