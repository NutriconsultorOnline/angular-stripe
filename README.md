angularjs-conekta [![Build Status](https://travis-ci.org/NutriconsultorOnline/angularjs-conekta.svg?branch=master)](https://travis-ci.org/NutriconsultorOnline/angularjs-conekta) [![dependencies Status](https://david-dm.org/NutriconsultorOnline/angularjs-conekta/status.svg)](https://david-dm.org/NutriconsultorOnline/angularjs-conekta) [![devDependencies Status](https://david-dm.org/NutriconsultorOnline/angularjs-conekta/dev-status.svg)](https://david-dm.org/NutriconsultorOnline/angularjs-conekta?type=dev)
==============

Angular provider for easy interaction with [Conekta.js](https://developers.conekta.com/libraries/javascript). angularjs-conekta wraps Conekta.js's async operations in `$q` promises, making response handling easier and eliminating `$scope.$apply` calls and other repetitive boilerplate in your application. Check out [angular-credit-cards](https://github.com/bendrucker/angular-credit-cards) for validating your credit card forms.

## Installing

```sh
npm install --save angularjs-conekta
```

## Usage

angularjs-conekta will load Conekta.js when it's first called. You don't need to directly [include Conekta.js via a `<script>` tag](https://developers.conekta.com/libraries/javascript).

```js
// node module exports the string 'angularjs-conekta' for convenience
angular.module('myApp', [
  require('angularjs-conekta')
])

// otherwise, include the code first then the module name
angular.module('myApp', [
  'angularjs-conekta'
])
```

## API

### `conektaProvider`

angularjs-conekta exposes `conektaProvider` for configuring Conekta.js.

##### `conektaProvider.url`

The URL that will be used to fetch the Conekta.js library.

##### `conektaProvider.setPublicKey(key)` -> `undefined`

Sets your Conekta [public key](https://developers.conekta.com/libraries/javascript). 

```js
angular
  .module('myApp', [
    'angularjs-conekta'
  ])
  .config(function (conektaProvider) {
    conektaProvider.setPublicKey('my_key')
  })
```

<hr>

### `conekta`

Inject `conekta` into your services or controllers to access the API methods. `token.create` returns a `$q` promise. If Conekta responds with an error, the promise will be rejected. 

---

##### `conekta.setPublicKey(key)` -> `undefined`

Same as [`conektaProvider.setPublicKey`](#conektaprovidersetpublickeykey---undefined)

---

### `conekta.token`

##### `conekta.token.create(card)` -> `promise`
 
Tokenizes a card using [`Conekta.token.create`](https://developers.conekta.com/tutorials/card).

### `conekta.card`

The following utility methods are exposed:

* `validateNumber`
* `validateExpirationDate`
* `validateCVC`
* `getBrand`

---

## Examples

#### Charging a card

```js
app.controller('PaymentController', function ($scope, $http, conekta) {
  $scope.charge = function charge () {
    return conekta.token.create($scope.payment.card)
      .then(function (response) {
        console.log('token created for a card')
        var payment = angular.copy($scope.payment)
        payment.card = undefined
        payment.token = response.id
        return $http.post('https://yourserver.com/payments', payment)
      })
      .then(function (payment) {
        console.log('successfully submitted payment for $', payment.amount)
      })
      .catch(function (err) {
        console.log('Payment error: ', err.message)
      })
  }
})
```
