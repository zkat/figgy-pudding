'use strict'

module.exports = figgyPudding
function figgyPudding (spec) {
  var optSpec = new OptSpec(spec)
  function factory (opts, metaOpts) {
    return new (optSpec.Opts)(opts, metaOpts)
  }
  factory.derive = deriveOpts
  return factory
}

function OptSpec (spec) {
  this.isOptSpec = true
  this.spec = spec
  this.derivatives = []
  this.Opts = buildOpts(this)
}

function buildOpts (spec) {
  return function Opts (opts, pudOpts) {
    opts = opts || {}
    pudOpts = pudOpts || {}
    var pud = this
    Object.defineProperty(pud, '__root__', {
      enumerable: false,
      value: opts.__root__ || opts
    })
    Object.keys(spec.spec).forEach(function (key) {
      pud[key] = processKey(key, spec.spec, opts)
    })
    Object.preventExtensions(pud)
    if (!pudOpts.mutable) {
      Object.freeze(pud)
    }
  }
}

function processKey (key, spec, opts, root) {
  var val = opts[key] !== undefined
  ? opts[key]
  : opts.__root__ && opts.__root__[key] !== undefined
  ? opts.__root__[key]
  : spec[key].default
  return val
}

function deriveOpts (pudding) {
  this.derivatives.push(pudding)
  return this
}
