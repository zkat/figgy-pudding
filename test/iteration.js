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
test('entries')
test('Symbol.iterator')
test('keys')
test('values')
