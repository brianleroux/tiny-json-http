var test = require('tape')
var express = require('express')
var app = express()
var tiny = require('./')
var server

app.post('/', (req, res)=> {
  res.json({ok:true}).end()
})

test('startup', t=> {
  t.plan(1)
  server = app.listen(3000, x=> {
    t.ok(true, 'started server')
  })
})

test('can post', t=> {
  t.plan(1)
  var url = 'http://localhost:3000/'
  var json = true
  tiny.post({url, json}, function __posted(err, result) {
      console.log('got something', err, result)
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(result, 'got a result')
      console.log(result)
    } 
  })
})

test('shutdown', t=> {
  t.plan(1)
  server.close()
  t.ok(true, 'closed server')
})
