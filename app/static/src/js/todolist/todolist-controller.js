'use strict';

angular.module('todotail').controller('TodoListCtrl', [
    '$scope',
    'Restangular',
    '_',

    function ($scope, Restangular, _) {
        //@TODO: Abstract away the data handling to a service instead, so we don't have to worry about keeping
        //$scope and the backend in sync within the controller.
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
                        $scope.tasks[index].put();
                    }
                }
            };
        });

        $scope.doneChanged = function(index) {
            $scope.tasks[index].put();
        };


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
            // In order to add new items to the top of the list, we need to find the lowest order value and subtract one,
            // since ui-sortable can't do orderBy
            var lowestTask = _.min(Restangular.stripRestangular($scope.tasks), function(task) { return task.order; });
            var order = (lowestTask.order === null) ? 0 : parseInt(lowestTask.order, 10)-1;

            Todo.post({
                title: $scope.task.title,
                done: false,
                order: order
            }).then(function(response) {
                $scope.tasks.unshift(response);
                $scope.task = null;
            });
        };

        $scope.deleteDone = function() {
            angular.forEach($scope.tasks, function(value, key) {
                if (value.done === true) {
                    $scope.delete(value.id);
                }
            });
        };

        $scope.delete = function(id) {
            var taskToDelete = _.find($scope.tasks, function(task) {
                return task.id === id;
            });

            taskToDelete.remove().then(function() {
                $scope.tasks.splice($scope.tasks.indexOf(taskToDelete), 1);
            });
        }
    }
]);