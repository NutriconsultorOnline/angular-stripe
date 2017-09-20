'use strict'

/* global describe, it, beforeEach, afterEach */

var angular = require('angular')
require('angular-mocks/ngMock')
var sinon = require('sinon')
var expect = require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).expect
var angularConekta = require('../')

var inject = angular.mock.inject

describe('conekta: Service', function () {
  window.mocha.options.globals = (window.mocha.options.globals || []).concat(['Conekta'])

  this.timeout(500)

  beforeEach(angular.mock.module(angularConekta))

  var data, response, sandbox
  beforeEach(function () {
    data = {}
    response = {}
    sandbox = sinon.sandbox.create()
  })
  afterEach(function () {
    sandbox.restore()
  })

  it('exposes #setPublicKey', inject(function (conekta) {
    expect(typeof conekta.setPublicKey).to.equal('function')
  }))

  it('can lazily set the publishable key', function () {
    var p
    inject(function (conekta) {
      p = conekta.setPublicKey('public_key_for_testing')
        .then(function () {
          expect(typeof window.Conekta).to.equal('object')
          expect(window.Conekta.getPublicKey()).to.equal('public_key_for_testing')
        })
    })

    return p
  })

  describe('card', function () {
    describe('#createToken', function () {
      it('resolves on success', function () {
        var p
        inject(function (conekta) {
          sinon.stub(window.Conekta.token, 'create').yieldsAsync(response)

          p = conekta.token.create(data).then(function (res) {
            expect(res).to.equal(response)
          })
        })

        return p
      })

      it('rejects on error', function () {
        var p
        inject(function (conekta) {
          response = {
            type: 'parameter_validation_error',
            message: 'Something went wrong on Conekta\'s end',
            message_to_purchaser: 'Your code could not be processed, please try again later',
            error_code: 'invalid_expiry_month',
            param: 'card[exp_month]'
          }

          window.Conekta.token.create.restore()
          sinon.stub(window.Conekta.token, 'create').callsArgWithAsync(2, response)

          p = expect(conekta.token.create(data)).to.be.rejected
            .then(function (err) {
              expect(err.type).to.contain(response.type)
              expect(err.message).to.contain(response.message)
              expect(err.message_to_purchaser).to.contain(response.message_to_purchaser)
              expect(err.error_code).to.contain(response.error_code)
              expect(err.param).to.contain(response.param)
            })
        })

        return p
      })
    })
  })
})
