'use strict';

angular.module('todotail')
    .controller('TodoListCtrl', function($scope, Restangular) {
        Restangular.all('todos').getList().then(function(todos) {
            $scope.todos = todos;
        });
    });