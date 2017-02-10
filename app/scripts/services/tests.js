'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.service:TestsService
 * @description
 * # TestsService
 * Service of the frontendStableApp
 */
angular.module('frontendStableApp')
    .service('TestsService', function (ResourcesGeneratorService, AuthService, $q, Config, $sce, $http, $window) {
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

        this.getClassResults = function (testId) {
            if (!AuthService.isLogged || !AuthService.allowedForbidden('teacher', 'admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService
                .getResource(AuthService.getAuthToken(), 'tests/:testId/results')
                .query({
                    testId: testId
                })
                .$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.getClassCSVResults = function (testId) {
            if (!AuthService.isLogged || !AuthService.allowedForbidden('teacher', 'admin'))
                return $q.reject("User not logged in");

            return $http.get(Config.getServerPath() + 'tests/' + testId + '/results.csv', {
                responseType: 'arraybuffer',
                headers: {
                    'X-Authorization-Token': AuthService.getAuthToken()
                }
            })
                .then(function (response) {
                    var file = new Blob([response.data], {type: 'text/csv'});
                    var fileURL = $window.URL.createObjectURL(file);
                    // return $sce.trustAsResourceUrl(fileURL);
                    return fileURL;
                }, ResourcesGeneratorService.failureHandler);
        };

        this.getStudentResult = function (studentId, testId) {
            if (!AuthService.isLogged || AuthService.atLeast('admin')) // Solo < di admin
                return $q.reject("User not logged in");

            return ResourcesGeneratorService
                .getResource(AuthService.getAuthToken(), 'tests/:testId/users/:studentId/details')
                .query({
                    testId: testId,
                    studentId: studentId
                })
                .$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };
    });
