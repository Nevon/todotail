'use strict';

angular.module('todotail').controller('TodoListCtrl', [
    '$scope',
    'TaskService',
    '_',

    function ($scope, TaskService, _) {
        TaskService.getList().then(function (tasks) {
            $scope.tasks = tasks;

            $scope.tasks.sort(function (a, b) {
                return a.order > b.order;
            });

            //The ui-sortable directive isn't build to handle using orderBy in the markup, so we have to sort our items
            //in the controller before assigning them to the scope. This causes one PUT request for each item in the list.
            //
            // @TODO: Add bulk endpoint for PUT/PATCH requests
            $scope.sortableOptions = {
                stop: function () {
                    angular.forEach($scope.tasks, function (value, key) {
                        value.order = parseInt(key, 10);
                        TaskService.saveTask(value);
                    });
                },
                axis: 'y',
                handle: '.move-handle'
            };
        });

        $scope.doneChanged = function (id) {
            var taskChanged = _.find($scope.tasks, function (task) {
                return task.id === id;
            });

            if (taskChanged) {
                TaskService.saveTask(taskChanged);
            }
        };

        // This is incredibly inefficient, but flask-restless seems to have
        // an issue with updating multiple instances with one PUT/PATCH request, even if it's the same value
        // across all items.
        //
        // @TODO: Replace flask-restless with eve or flask-restful.
        // @TODO: Use customPUT to at least update all instances with the same data. Good enough for marking all as complete.
        $scope.markAllComplete = function () {
            angular.forEach($scope.tasks, function (value) {
                value.done = true;
                TaskService.saveTask(value);
            });
        };

        $scope.addTask = function () {
            // In order to add new items to the top of the list, we need to find the lowest order value and subtract one,
            // since ui-sortable can't do orderBy
            var lowestTask = _.min($scope.tasks, function (task) { return task.order; });
            var order = (lowestTask.order === null) ? 0 : parseInt(lowestTask.order, 10) - 1;

            TaskService.addTask({
                title: $scope.task.title,
                done: false,
                order: order
            }).then(function (response) {
                $scope.tasks.unshift(response);
                $scope.task = null;
            });
        };

        $scope.deleteDone = function () {
            angular.forEach($scope.tasks, function (value) {
                if (value.done === true) {
                    $scope.deleteTask(value.id);
                }
            });
        };

        $scope.deleteTask = function (id) {
            var taskToDelete = _.find($scope.tasks, function (task) {
                return task.id === id;
            });

            if (taskToDelete) {
                TaskService.deleteTask(taskToDelete).then(function () {
                    $scope.tasks.splice($scope.tasks.indexOf(taskToDelete), 1);
                });
            }
        };
    }
]);