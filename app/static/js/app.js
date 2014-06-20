'use strict';
angular.module('todotail', [
    'restangular'
]).config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('/api');
});