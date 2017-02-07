# figgy-pudding [![npm version](https://img.shields.io/npm/v/figgy-pudding.svg)](https://npm.im/figgy-pudding) [![license](https://img.shields.io/npm/l/figgy-pudding.svg)](https://npm.im/figgy-pudding) [![Travis](https://img.shields.io/travis/zkat/figgy-pudding.svg)](https://travis-ci.org/zkat/figgy-pudding) [![AppVeyor](https://ci.appveyor.com/api/projects/status/github/zkat/figgy-pudding?svg=true)](https://ci.appveyor.com/project/zkat/figgy-pudding) [![Coverage Status](https://coveralls.io/repos/github/zkat/figgy-pudding/badge.svg?branch=latest)](https://coveralls.io/github/zkat/figgy-pudding?branch=latest)

# Death to the God Object! Now Bring Us Some Figgy Pudding!

[`figgy-pudding`](https://github.com/zkat/figgy-pudding) is a simple JavaScript library for managing and composing cascading options objects -- hiding what needs to be hidden from each layer, without having to do a lot of manual munging and passing of options.

## Install

`$ npm install --save figgy-pudding`

## Table of Contents

* [Example](#example)
* [Features](#features)
* [API](#api)
  * [`figgyPudding(spec)`](#figgy-pudding)
  * [`Opts(values)`](#opts)

### Example

```javascript
const figgyPudding = require('figgyPudding')

const RequestOpts = figgyPudding({
  follow: {
    default: true
  },
  streaming: {
    default: false
  },
  log: {
    default: require('npmlog')
  }
})

const MyAppOpts = figgyPudding({
  log: {
    default: require('npmlog')
  },
  cache: {
    default: './cache'
  }
})

function start (opts) {
  opts = MyAppOpts(opts)
  initCache(opts.cache)
  opts.streaming // => undefined
  reqStuff('https://npm.im/figgy-pudding', opts)
}

function reqStuff (uri, opts) {
  opts = RequestOpts(opts)
  require('request').get(uri, opts) // can't see `cache`
}
```

### Features

* Top-down options
* Hide options from layer that didn't ask for it
* Shared multi-layer options
* Immutable by default

### Guide

#### Introduction

### API

#### <a name="figgy-pudding"></a> `> figgyPudding({ key: { default: val }})`

Defines an Options object that can be used to collect only the needed options.

An optional `default` property for specs can be used to specify default values
if nothing was passed in.

##### Example

```javascript
const MyAppOpts = figgyPudding({
  log: {
    default: require('npmlog')
  },
  cache: {}
})
```

#### <a name="opts"></a> `> Opts(options, metaOpts)`

Instantiates an options object defined by `figgyPudding()`. The returned object
will be immutable and non-extensible, and will only include properties defined
in the Opts spec.

The returned opts object can be made mutable by making `metaOpts.mutable` true.

`options` can be either a plain object or another `Opts` object. In the latter
case, the original root options (a plain object) will be used as a fallback
for properties missing from `options`

##### Example

```javascript
const ReqOpts = figgyPudding({
  follow: {}
})

const opts = ReqOpts({
  follow: true,
  log: require('npmlog')
})

opts.follow // => true
opts.log // => false (not defined by ReqOpts)

const MoreOpts = figgyPudding({
  log: {}
})
MoreOpts(opts).log // => npmlog object (passed in from original plain obj)
```
