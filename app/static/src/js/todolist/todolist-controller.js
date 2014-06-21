'use strict';

angular.module('todotail').controller('TodoListCtrl', [
    '$scope',
    'Restangular',

    function ($scope, Restangular) {
        var Todo = Restangular.all('todo');

        Todo.getList().then(function (tasks) {
            $scope.tasks = tasks;

            $scope.tasks.sort(function(a, b) {
                return a.order > b.order;
            });

            //The ui-sortable directive isn't build to handle using orderBy in the markup, so we have to sort our items
            //in the controller before assigning them to the scope.
            $scope.sortableOptions = {
                stop: function(e, ui) {
                    for (var index in Restangular.stripRestangular($scope.tasks)) {
                        $scope.tasks[index].order = parseInt(index, 10);
                    }
                }
            };

            $scope.$watch('tasks', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                for (var index in Restangular.stripRestangular($scope.tasks)) {
                    $scope.tasks[index].put();
                }
            }, true);
        });


        // This is incredibly inefficient, but flask-restless seems to have
        // an issue with updating multiple instances with one PUT/PATCH request.
        //
        // @TODO: Replace flask-restless with eve or flask-restful.
        // @TODO: Use customPUT to at least update all instances with the same data. Good enough for marking all as complete.
        $scope.markAllComplete = function() {
            angular.forEach($scope.tasks, function(value, key) {
                value.done = true;
                value.put();
            });
        };

        $scope.addTask = function() {
            Todo.post({
                title: $scope.task.title,
                done: false
            }).then(function(response) {
                $scope.tasks.push(response);
            });
        };

        $scope.deleteDone = function() {
            angular.forEach($scope.tasks, function(value, key) {
                if (value.done === true) {
                    $scope.delete(key);
                }
            });
        };

        $scope.delete = function(index) {
            $scope.tasks[index].remove().then(function() {
                $scope.tasks.splice(index, 1);
            });
        }
    }
]);