'use strict'

/* global describe, it */

var angular = require('angular')
require('angular-mocks/ngMock')
var expect = require('chai').expect
var angularConekta = require('../')

describe('Provider', function () {
  it('exposes Conekta#setPublicKey', function (done) {
    angular.mock.module(angularConekta, function (conektaProvider) {
      expect(typeof conektaProvider.setPublicKey).to.equal('function')
      done()
    })
    angular.mock.inject()
  })

  it('exposes url', function (done) {
    angular.mock.module(angularConekta, function (conektaProvider) {
      expect(typeof conektaProvider.url).to.equal('string')
      done()
    })
    angular.mock.inject()
  })
})
