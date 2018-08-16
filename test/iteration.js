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
