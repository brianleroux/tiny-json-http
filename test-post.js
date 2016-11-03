var test = require('tape')
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var tiny = require('./')
var server

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.post('/', (req, res)=> {
  res.json(Object.assign(req.body, {gotPost:true, ok:true}))
})

app.put('/', (req, res)=> {
  res.json(Object.assign(req.body, {gotPut:true, ok:true}))
})

app.delete('/', (req, res)=> {
  res.json(Object.assign(req.body, {gotDel:true, ok:true}))
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
      t.ok(result.gotPost, 'got a post')
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
      t.ok(result.gotPut, 'got a put')
      console.log(result)
    } 
  })
})

test('can del', t=> {
  t.plan(2)
  var url = 'http://localhost:3000/'
  var data = {a:1, b:new Date(Date.now()).toISOString()}
  tiny.del({url, data}, function __posted(err, result) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(result, 'got a result')
      t.ok(result.gotDel, 'got a del')
      console.log(result)
    } 
  })
})

test('shutdown', t=> {
  t.plan(1)
  server.close()
  t.ok(true, 'closed server')
})
