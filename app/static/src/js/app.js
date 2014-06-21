'use strict';

angular.module('todotail', [
    'ui.sortable',
    'restangular',
    'lodash'
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
                    numResults: response.num_results,
                    page: response.page,
                    totalPages: response.total_pages
                };
            } else {
                newResponse = response;
            }

            return newResponse;
        });
    }
]);