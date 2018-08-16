'use strict'

const test = require('tap').test
const puddin = require('../')

test('forEach', t => {
  const testOpts = puddin({
    a: {},
    b: {}
  })
  const arr = []
  let thisArg
  const expectedThis = {}
  const opts = testOpts({a: 1, b: 2, c: 3})
  opts.forEach(function (...args) {
    thisArg = this
    arr.push(args)
  }, expectedThis)
  t.equal(thisArg, expectedThis, 'correct thisArg')
  t.deepEqual(arr, [
    [1, 'a', opts],
    [2, 'b', opts]
  ], 'correct arguments, and only declared props, in declared order')
  t.done()
})

test('entries', t => {
  const testOpts = puddin({
    a: {},
    b: {}
  })
  const arr = []
  const opts = testOpts({a: 1, b: 2, c: 3})
  for (let [key, value] of opts.entries()) {
    arr.push([key, value])
  }
  t.deepEqual(arr, [
    ['a', 1],
    ['b', 2]
  ], 'correct arguments, and only declared props, in declared order')
  t.done()
})

test('entries over nested puddings', t => {
  const testOpts = puddin({
    a: {},
    b: {}
  })
  const nestedOpts = puddin({}) // actual values declared should not matter
  const arr = []
  const opts = testOpts({a: 1}).concat(
    {b: 3},
    nestedOpts({}).concat(nestedOpts({b: 2}))
  )
  for (let [key, value] of opts.entries()) {
    arr.push([key, value])
  }
  t.deepEqual(arr, [
    ['a', 1],
    ['b', 2]
  ], 'reaches into nested puddings even if they don\'t declare a key')
  t.done()
})

test('Symbol.iterator', t => {
  const testOpts = puddin({
    a: {},
    b: {}
  })
  const arr = []
  const opts = testOpts({a: 1, b: 2, c: 3})
  for (let [key, value] of opts) {
    arr.push([key, value])
  }
  t.deepEqual(arr, [
    ['a', 1],
    ['b', 2]
  ], 'pudding itself is an iterator')
  t.done()
})

test('keys', t => {
  const testOpts = puddin({
    a: {},
    b: {}
  })
  const arr = []
  const opts = testOpts({a: 1, b: 2, c: 3})
  for (let key of opts.keys()) {
    arr.push(key)
  }
  t.deepEqual(arr, [
    'a', 'b'
  ], '.keys() iterates over keys')
  t.done()
})

test('values', t => {
  const testOpts = puddin({
    a: {},
    b: {}
  })
  const arr = []
  const opts = testOpts({a: 1, b: 2, c: 3})
  for (let key of opts.values()) {
    arr.push(key)
  }
  t.deepEqual(arr, [
    1, 2
  ], '.values() iterates over values')
  t.done()
})

test('opts.other iteration', t => {
  const testOpts = puddin({
    a: {}
  }, {
    other (key) { return /^special-/.test(key) }
  })
  const arr = []
  const opts = testOpts({
    'special-a': 3,
    a: 1,
    b: 2,
    'special-b': 4,
    'a-special': 5
  })
  for (let [key, value] of opts.entries()) {
    arr.push([key, value])
  }
  t.deepEqual(arr, [
    ['a', 1],
    ['special-a', 3],
    ['special-b', 4]
  ], 'iterates over opts.other keys after primary keys')
  t.done()
})

test('opts.other iteration over nested puddings', t => {
  const testOpts = puddin({
    a: {}
  }, {
    other (key) { return /^special-/.test(key) }
  })
  const nestedOpts = puddin({
    b: {}
  })
  const arr = []
  const opts = testOpts({
    'special-b': 4
  }).concat({a: 3}, nestedOpts({
    a: 1,
    'a-special': 5
  }).concat(nestedOpts({
    b: 2,
    'special-a': 3
  })))
  for (let [key, value] of opts.entries()) {
    arr.push([key, value])
  }
  t.deepEqual(arr, [
    ['a', 1],
    ['special-a', 3],
    ['special-b', 4]
  ], 'expected order even with nested opts.others')
  t.done()
})
