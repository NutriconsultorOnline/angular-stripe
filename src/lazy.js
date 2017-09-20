'use strict'

var Lazy = require('lazy-async')
var dot = require('dot-prop')
var loadScript = require('load-script-global')
var conektaErrback = require('conekta-errback')

module.exports = LazyConekta

function LazyConekta (url, promisify) {
  var methods = conektaErrback.methods.async.concat(conektaErrback.methods.sync)
  var lazy = Lazy(methods, load)

  return methods.reduce(function (acc, method) {
    var fn = dot.get(lazy, method)
    dot.set(acc, method, promisify(fn))
    return acc
  }, {})

  function load (callback) {
    if (window.Conekta) {
      onLoad(null, window.Conekta)
    } else {
      loadScript({
        url: url,
        global: 'Conekta'
      }, onLoad)
    }

    function onLoad (err, Conekta) {
      if (err) return callback(err)
      var conekta = conektaErrback(Conekta)
      conekta.setPublicKey = Success(conekta.setPublicKey, conekta)
      callback(null, conekta)
    }
  }
}

function Success (fn, context) {
  return function success () {
    var callback = Array.prototype.pop.call(arguments)
    fn.apply(context, arguments)
    callback()
  }
}
