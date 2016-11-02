var test = require('tape')
var tiny = require('./')

test('env', t=> {
  t.plan(5)
  t.ok(tiny, 'got a tiny')
  t.ok(tiny.get, 'got a tiny.get')
  t.ok(tiny.post, 'got a tiny.post')
  t.ok(tiny.put, 'got a tiny.put')
  t.ok(tiny.del, 'got a tiny.delete')
  console.log(tiny)
})

test('can get a url', t=> {
  t.plan(1)
  var url = 'https://brian.io'
  tiny.get({url}, function __got(err, result) {
    if (err) {
      t.fail(err.statusCode, 'failed to get')
      console.log(err)
    }
    else {
      t.ok(result, 'got a result')
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
      t.equal(typeof result, 'object', 'is an object')
      console.log(err, result)
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
