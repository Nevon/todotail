'use strict';

angular.module('todotail').factory('TaskService', [
    'Restangular',
    '$q',
    function (Restangular, $q) {
        var TaskService = {};
        var Todo = Restangular.all('todo');

        TaskService.getList = function () {
            var deferredResult = $q.defer();

            Todo.getList().then(function (result) {
                deferredResult.resolve(Restangular.stripRestangular(result));
            });

            return deferredResult.promise;
        };

        TaskService.addTask = function (task) {
            var deferredResult = $q.defer();

            Todo.post(task).then(function (result) {
                deferredResult.resolve(result.plain());
            });

            return deferredResult.promise;
        };

        TaskService.saveTask = function (task) {
            var deferredResult = $q.defer();
            var restangularizedTask = Restangular.restangularizeElement(null, task, 'todo');

            restangularizedTask.put().then(function () {
                deferredResult.resolve(task.plain());
            });

            return deferredResult.promise;
        };

        TaskService.deleteTask = function (task) {
            var deferredResult = $q.defer();
            var restangularizedTask = Restangular.restangularizeElement(null, task, 'todo');

            restangularizedTask.remove().then(function () {
                deferredResult.resolve();
            });

            return deferredResult.promise;
        };

        return TaskService;
    }
]);