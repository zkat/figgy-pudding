'use strict'

const test = require('tap').test
const puddin = require('../')

test('basic aliases', t => {
  const testOpts = puddin({
    a: {},
    b: 'a',
    c: {},
    d: 'b'
  })
  const opts = testOpts({a: 1, c: 2})
  t.equal(opts.get('a'), 1, 'base opt fetched normally')
  t.equal(opts.get('b'), 1, 'opt fetchable through alias')
  t.equal(opts.get('d'), 1, 'aliases chain')
  t.equal(opts.get('c'), 2, 'other opt unaffected')
  t.equal(testOpts({b: 3}).get('a'), 3, 'reverse alias works')
  t.throws(() => {
    puddin({
      b: 'a'
    })({})
  }, /invalid key: a -> b/)
  t.done()
})

test('transitive nested aliases', t => {
  const testOpts = puddin({
    a: 'b',
    b: {}
  })
  const nestedOpts = puddin({
    c: 'b',
    b: {}
  })
  const opts = testOpts({c: 2}).concat(nestedOpts({c: 1}))
  t.deepEqual(opts.toJSON(), {
    a: 1,
    b: 1
  }, 'nested transitive aliases work')
  t.done()
})
