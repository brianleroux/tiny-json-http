var test = require('tape')
var tiny = require('.')

test('env', t=> {
  t.plan(6)
  t.ok(tiny, 'got a tiny')
  t.ok(tiny.get, 'got a tiny.get')
  t.ok(tiny.post, 'got a tiny.post')
  t.ok(tiny.put, 'got a tiny.put')
  t.ok(tiny.patch, 'got a tiny.patch')
  t.ok(tiny.del, 'got a tiny.delete')
  console.log(tiny)
})

test('can get a url', async t=> {
  t.plan(3)
  var url = 'https://brian.io'
  try {
    var result = await tiny.get({url})
    t.ok(result, 'got a result')
    t.ok(result.headers, 'got headers')
    t.ok(result.body, 'got body')
    console.log(result)
  }
  catch(e) {
    t.fail(err.statusCode, 'failed to get')
    console.log(err)
  }
})

test('can get json', async t=> {
  t.plan(2)
  var url = 'https://api.github.com/'
  try {
    var result = await tiny.get({url})
    t.ok(result, 'got a result')
    t.equal(typeof result.body, 'object', 'body is an object')
    console.log(result)
  }
  catch(e) {
    t.fail(e)
  }
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

test('bad url gives a acually useful error with a fucking line number holy shit', async t=> {
  t.plan(1)
  try {
    var res = await tiny.get('')
    t.fail(res)
    console.log(res)
  }
  catch(e) {
    t.ok(e, 'res')
    console.log(e)
  }
})
