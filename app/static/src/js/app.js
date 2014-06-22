'use strict';

// @TODO: Add unit tests instead of relying on end-to-end tests.

angular.module('todotail', [
    'ui.sortable',
    'restangular',
    'lodash',
    'ngAnimate'
]).config([
    'RestangularProvider',
    function (RestangularProvider) {
        RestangularProvider.setBaseUrl('/api');

        // Flask-restless and restangular don't quite agree on the response format
        RestangularProvider.setResponseExtractor(function (response, operation) {
            var newResponse;

            if (operation === 'getList') {
                newResponse = response.objects;

                newResponse.metadata = {
                    numResults: response.numResults,
                    page: response.page,
                    totalPages: response.totalPages
                };
            } else {
                newResponse = response;
            }

            return newResponse;
        });
    }
]);