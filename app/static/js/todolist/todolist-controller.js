'use strict';

angular.module('todotail')
    .controller('TodoListCtrl', function($scope, Restangular) {
        Restangular.all('todo').getList().then(function(todos) {
            $scope.todos = todos;
        });
    });