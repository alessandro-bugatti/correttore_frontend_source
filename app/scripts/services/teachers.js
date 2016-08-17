'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.service:TeachersService
 * @description
 * # TeachersService
 * Service of the frontendStableApp
 */
angular.module('frontendStableApp')
    .service('TeachersService', function (ResourcesGeneratorService, AuthService, $q) {
        this.getList = function () {
            if (!AuthService.isLogged || !AuthService.atLeast('admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService.getResource(AuthService.getAuthToken(), 'teachers').query().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.getOneTeacher = function (teacherId) {
            if (!AuthService.isLogged || !AuthService.atLeast('admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService.getResource(AuthService.getAuthToken(), 'teachers/:id').get({id: teacherId}).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.addTeacher = function (name, surname, username, password) {
            if (!AuthService.isLogged || !AuthService.atLeast('admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService
                .getResource(AuthService.getAuthToken(), 'teachers/')
                .post({
                    name: name,
                    surname: surname,
                    username: username,
                    password: password,
                    role: 'teacher'
                }).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.updateTeacher = function (teacherId, name, surname, username, password) { // FIXME
            if (!AuthService.isLogged || !AuthService.atLeast('admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService
                .getResource(AuthService.getAuthToken(), 'teachers/:id')
                .put({id: teacherId}, {
                    name: name,
                    surname: surname,
                    username: username,
                    password: password,
                    role: 'teacher'
                }).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.deleteTeacher = function (teacherId) {
            if (!AuthService.isLogged || !AuthService.atLeast('admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService
                .getResource(AuthService.getAuthToken(), 'teachers/:id')
                .delete({id: teacherId})
                .$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        }
    });
