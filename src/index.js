'use strict'

var angular = require('angular')
var provider = require('./provider')

module.exports = angular.module('angularjs-conekta', [
  require('angular-q-promisify'),
  require('angular-assert-q-constructor')
])
.provider('conekta', provider)
.run(verifyQ)
.name

verifyQ.$inject = ['assertQConstructor']
function verifyQ (assertQConstructor) {
  assertQConstructor('angularjs-conekta: For Angular <= 1.2 support, first load https://github.com/bendrucker/angular-q-constructor')
}
