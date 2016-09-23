'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.service:TasksService
 * @description
 * # TasksService
 * Service of the frontendStableApp
 */
angular.module('frontendStableApp')
    .service('TasksService', function (ResourcesGeneratorService, Upload, Config, AuthService, $q) {
        this.getList = function () {
            if (!AuthService.isLogged || !AuthService.atLeast('teacher'))
                return $q.reject("User not logged in"); // FIXME: update error string

            return ResourcesGeneratorService.getResource(AuthService.getAuthToken(), 'tasks').query().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.getOneTask = function (taskId) {
            if (!AuthService.isLogged || !AuthService.atLeast('student')) // TODO: decidere chi puo' eseguire questa chiamata (https://bitbucket.org/correttore2/correttoreapi/src/4ff3b1e021938aab56da1ee36becaeec884ca44d/doc/task.md?at=categories)
                return $q.reject("User not logged in");

            return ResourcesGeneratorService.getResource(AuthService.getAuthToken(), 'tasks/:id').get({id: taskId}).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.addTask = function (formData) { // TODO: test
            if (!AuthService.isLogged || !AuthService.allowedForbidden('teacher', 'admin'))
                return $q.reject("User not logged in");

            var headersObj = {};
            headersObj[Config.getAuthTokenName()] = AuthService.getAuthToken();

            formData.is_public = formData.is_public ? 1 : 0;

            return Upload.upload({
                url: Config.getServerPath() + 'tasks/',
                headers: headersObj,
                data: formData
            })
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler, function (evt) {
                }); // FIXME: usare progresso
        };

        this.deleteTask = function (taskId) {
            if (!AuthService.isLogged || !AuthService.allowedForbidden('teacher', 'admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService
                .getResource(AuthService.getAuthToken(), 'tasks/:id')
                .delete({id: taskId})
                .$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        }
    });
