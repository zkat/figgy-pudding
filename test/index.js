'use strict'

const test = require('tap').test
const puddin = require('../')

test('basic property fetching', t => {
  const testOpts = puddin({
    a: {}
  })
  const opts = testOpts({a: 1, b: 2})
  t.equal(opts.get('a'), 1, 'defined opt fetched')
  t.throws(() => {
    opts.get('b')
  }, /invalid config key requested: b/i)
  t.done()
})

test('Map-like support', t => {
  const testOpts = puddin({
    a: {}
  })
  const opts = testOpts(new Map([['a', 1], ['b', 2]]))
  t.equal(opts.get('a'), 1, 'defined .get opt fetched')
  t.throws(() => {
    opts.get('b')
  }, /invalid config key requested: b/i)
  t.done()
})

test('passing through no args is ok', t => {
  const testOpts = puddin()
  const opts = testOpts({b: 2})
  t.throws(() => {
    opts.get('b')
  }, /invalid config key requested: b/i)
  t.done()
})

test('passing in null providers is ok', t => {
  const testOpts = puddin({
    a: {}
  })
  const opts = testOpts(null, {a: 1, b: 2}, false, undefined)
  t.equal(opts.get('a'), 1, 'defined opt fetched')
  t.throws(() => {
    opts.get('b')
  }, /invalid config key requested: b/i)
  t.done()
})

test('supports defaults', t => {
  const testOpts = puddin({
    a: {default: 1},
    b: {default: () => 2}
  })
  const opts = testOpts()
  t.equal(opts.get('a'), 1, 'got non-function default value')
  t.equal(opts.get('b'), 2, 'got function-based default value')
  t.done()
})

test('allow programmatic keys', t => {
  const testOpts = puddin({}, {
    other (key) { return key === 'c' || key === 'd' }
  })
  const opts = testOpts({a: 1, b: 2, c: 3, d: 4})
  t.equal(opts.get('c'), 3, 'programmatic key succeeded')
  t.equal(opts.get('d'), 4, 'other programmatic key succeeded')
  t.throws(
    () => opts.get('b'),
    /invalid config key requested: b/i,
    'non-defined, non-other key still fails'
  )
  t.done()
})

test('multiple providers', t => {
  const testOpts = puddin({
    a: {},
    b: {},
    c: {}
  })
  const opts = testOpts({a: 3, b: 3, c: 3}, {a: 2, b: 2}, {a: 1})
  t.equal(opts.get('a'), 1, 'a from first provider')
  t.equal(opts.get('b'), 2, 'b from second provider')
  t.equal(opts.get('c'), 3, 'c from third provider')
  t.done()
})

test('nesting puds', t => {
  const topPud = puddin({
    a: {}
  })
  const childPud = puddin({
    b: {}
  })
  const granPud = puddin({
    c: {}
  })
  const grandchild = granPud({a: 1, b: 2, c: 3})
  const child = childPud(grandchild)
  const top = topPud(child)
  t.equal(top.get('a'), 1, 'topPud property fetched successfully')
  t.equal(child.get('b'), 2, 'childPud property fetched successfully')
  t.equal(grandchild.get('c'), 3, 'granPud property fetched successfully')
  t.throws(
    () => top.get('b'),
    /invalid config key requested: b/i,
    'topPud has no access to childPud property'
  )
  t.throws(
    () => child.get('a'),
    /invalid config key requested: a/i,
    'childPud has no access to childPud property'
  )
  t.throws(
    () => grandchild.get('b'),
    /invalid config key requested: b/i,
    'granPud has no access to childPud property'
  )
  t.done()
})

test('nested pud defaults', t => {
  const topPud = puddin({
    a: {}
  })
  const childPud = puddin({
    a: {default: 2}
  })
  const child = childPud({b: 'idk'})
  const top = topPud(child)
  t.equal(top.get('a'), 2, 'topPud property uses childPud defaults')
  t.equal(child.get('a'), 2, 'childPud property uses own defaults')
  t.done()
})

test('concat', t => {
  const testOpts = puddin({
    a: {},
    b: {},
    c: {}
  })
  let opts = testOpts()
  opts = opts.concat({a: 3, b: 3, c: 3})
  t.equal(opts.get('c'), 3, 'c from third provider')
  opts = opts.concat({a: 2, b: 2}, {a: 1})
  t.equal(opts.get('a'), 1, 'a from first provider')
  t.equal(opts.get('b'), 2, 'b from second provider')
  t.done()
})

test('is delicious and figgy')
