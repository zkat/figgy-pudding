'use strict'

const test = require('tap').test
const puddin = require('../')
const util = require('util')

test('basic toJSON', t => {
  const testOpts = puddin({
    a: {}
  })
  const opts = testOpts({a: 1, b: 2})
  t.deepEqual(opts.toJSON(), {
    a: 1
  }, 'only declared properties included')
  t.equal(
    JSON.stringify(opts),
    JSON.stringify({a: 1}),
    'works with JSON.stringify()'
  )
  t.done()
})

test('toJSON for puddings with `opts.other`', t => {
  const testOpts = puddin({
    a: {}
  }, {
    other (key) { return /^special-/.test(key) }
  })
  const opts = testOpts({
    'special-a': 3,
    a: 1,
    b: 2,
    'special-b': 4,
    'a-special': 5
  })
  t.deepEqual(Object.entries(opts.toJSON()), [
    ['a', 1],
    ['special-a', 3],
    ['special-b', 4]
  ], 'serializes special opts.other keys')
  t.done()
})

test('toJSON for nested puddings with opts.other', t => {
  const testOpts = puddin({
    a: {}
  }, {
    other (key) { return /^special-/.test(key) }
  })
  const nestedOpts = puddin({
    b: {}
  })
  const opts = testOpts({
    'special-b': 4
  }).concat({a: 3}, nestedOpts({
    a: 1,
    'a-special': 5
  }).concat(nestedOpts({
    b: 2,
    'special-a': 3
  })))
  t.deepEqual(Object.entries(opts.toJSON()), [
    ['a', 1],
    ['special-a', 3],
    ['special-b', 4]
  ], 'expected order even with nested opts.others')
  t.done()
})

test('util.inspect support', t => {
  const testOpts = puddin({
    a: {}
  })
  const opts = testOpts({
    a: 1
  })
  t.equal(
    util.inspect(opts, {color: false}),
    'FiggyPudding { a: 1 }',
    'has a custom util.inspect method'
  )
  t.done()
})
