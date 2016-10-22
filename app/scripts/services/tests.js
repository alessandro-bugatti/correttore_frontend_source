'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.service:TestsService
 * @description
 * # TestsService
 * Service of the frontendStableApp
 */
angular.module('frontendStableApp')
    .service('TestsService', function (ResourcesGeneratorService, AuthService, $q) {
        this.getList = function () {
            if (!AuthService.isLogged || !AuthService.atLeast('student') || AuthService.atLeast('admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService.getResource(AuthService.getAuthToken(), 'tests').query().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.getTasks = function (testId) {
            if (!AuthService.isLogged || !AuthService.atLeast('student') || AuthService.atLeast('admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService.getResource(AuthService.getAuthToken(), 'tests/:testId/tasks')
                .query({
                    testId: testId
                })
                .$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.addTest = function (description) {
            if (!AuthService.isLogged || !AuthService.allowedForbidden('teacher', 'admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService.getResource(AuthService.getAuthToken(), 'tests').post({
                description: description
            }).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.updateTest = function (testId, newObj) {
            if (!AuthService.isLogged || !AuthService.allowedForbidden('teacher', 'admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService.getResource(AuthService.getAuthToken(), 'tests/:id')
                .put(
                    {id: testId},
                    newObj)
                .$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.deleteTest = function (testId) {
            if (!AuthService.isLogged || !AuthService.allowedForbidden('teacher', 'admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService
                .getResource(AuthService.getAuthToken(), 'tests/:id')
                .delete({id: testId})
                .$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.assignTaskToTest = function (taskId, testId) {
            if (!AuthService.isLogged || !AuthService.allowedForbidden('teacher', 'admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService
                .getResource(AuthService.getAuthToken(), 'tests/:testId/task/:taskId')
                .put({
                    testId: testId,
                    taskId: taskId
                })
                .$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.removeTaskFromTest = function (taskId, testId) {
            if (!AuthService.isLogged || !AuthService.allowedForbidden('teacher', 'admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService
                .getResource(AuthService.getAuthToken(), 'tests/:testId/task/:taskId')
                .delete({
                    testId: testId,
                    taskId: taskId
                })
                .$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };
    });
