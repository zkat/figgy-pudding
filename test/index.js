'use strict'

var test = require('tap').test
var figgyPudding = require('../')

test('basic opt object', function (t) {
  var TestOpts = figgyPudding({
    a: {}
  })
  var opts = TestOpts({a: 1, b: 2})
  t.deepEqual(opts, {
    a: 1
  }, 'only defined opts made available for reading')
  t.done()
})

test('disallows opt modification', function (t) {
  var TestOpts = figgyPudding({ a: {} })
  var opts = TestOpts({a: 1})
  t.throws(function () {
    opts.b = 2
  }, /not extensible/, 'opt extension disallowed')
  t.throws(function () {
    opts.a = 'ayy'
  }, /read only/, 'opt reassignment disallowed')
  t.done()
})

test('allows extra option for mutability', function (t) {
  var TestOpts = figgyPudding({ a: {} })
  var opts = TestOpts({a: 1}, {mutable: true})
  opts.a = 2
  t.equal(opts.a, 2, 'a was modified')
  t.throws(function () {
    opts.b = 2
  }, /not extensible/, 'opt extension still disallowed')
  t.done()
})

test('assigns defaults if value missing', function (t) {
  var TestOpts = figgyPudding({
    a: { default: 'nope' },
    b: { default: 'hi' }
  })
  var opts = TestOpts({a: 1})
  t.deepEqual(opts, {
    a: 1,
    b: 'hi'
  }, 'default only used if missing from input')
  t.done()
})

test('cascading values', function (t) {
  var topOpts = {a: 1, b: 2, c: 3}
  var ParentOpts = figgyPudding({
    a: {}
  })
  var ChildOpts = figgyPudding({
    b: {}
  })
  var GrandOpts = figgyPudding({
    c: {}
  })

  var parent = ParentOpts(topOpts)
  var child = ChildOpts(parent)
  var grand = GrandOpts(child)
  var orphan = ChildOpts(topOpts)

  t.deepEqual(parent, {
    a: 1
  }, 'parent only grabs `a`')

  t.deepEqual(child, {
    b: 2
  }, 'child grabs `b` from toplevel')

  t.deepEqual(grand, {
    c: 3
  }, 'grandchild grabs `c` from toplevel')

  t.deepEqual(orphan, {
    b: 2
  }, 'orphan works fine without parent pudding')

  t.done()
})

test('verifies types of options')
test('key alias mapping for child opts')
test('is delicious and figgy')
