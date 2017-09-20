'use strict'

var LazyConekta = require('./lazy')

module.exports = conektaProvider

function conektaProvider () {
  var key = null
  var conekta = null

  this.url = 'https://cdn.conekta.io/js/latest/conekta.min.js'
  this.setPublicKey = function setPublicKey (_key) {
    key = _key
  }

  this.$get = service
  this.$get.$inject = ['promisify', '$exceptionHandler']

  function service (promisify, $exceptionHandler) {
    if (conekta) return conekta
    conekta = LazyConekta(this.url, promisify)
    conekta.setPublicKey(key)
    return conekta
  }
}
