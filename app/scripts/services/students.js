'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.service:StudentsService
 * @description
 * # StudentsService
 * Service of the frontendStableApp
 */
angular.module('frontendStableApp')
    .service('StudentsService', function (ResourcesGeneratorService, AuthService, $q) {
        this.getList = function () {
            if (!AuthService.isLogged || !AuthService.atLeast('teacher') || AuthService.atLeast('admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService.getResource(AuthService.getAuthToken(), 'students').query().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.getOneStudent = function (studentId) {
            if (!AuthService.isLogged || !AuthService.atLeast('teacher') || AuthService.atLeast('admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService.getResource(AuthService.getAuthToken(), 'students/:id').get({id: studentId}).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.addStudent = function (name, surname, username, password) {
            if (!AuthService.isLogged || !AuthService.atLeast('teacher') || AuthService.atLeast('admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService
                .getResource(AuthService.getAuthToken(), 'students/')
                .post({
                    name: name,
                    surname: surname,
                    username: username,
                    password: password,
                    role: 'student'
                }).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.updateStudent = function (studentId, name, surname, username, password) { // FIXME
            if (!AuthService.isLogged || !AuthService.atLeast('teacher') || AuthService.atLeast('admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService
                .getResource(AuthService.getAuthToken(), 'students/:id')
                .put({id: studentId}, {
                    name: name,
                    surname: surname,
                    username: username,
                    password: password,
                    role: 'student'
                }).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.deleteStudent = function (studentId) {
            if (!AuthService.isLogged || !AuthService.atLeast('teacher') || AuthService.atLeast('admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService
                .getResource(AuthService.getAuthToken(), 'students/:id')
                .delete({id: studentId})
                .$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        }
    });
