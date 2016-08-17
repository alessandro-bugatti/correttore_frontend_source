'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.service:GroupsService
 * @description
 * # GroupsService
 * Service of the frontendStableApp
 */
angular.module('frontendStableApp')
    .service('GroupsService', function (ResourcesGeneratorService, AuthService, $q) {
        this.getList = function () {
            if (!AuthService.isLogged || !AuthService.atLeast('teacher'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService.getResource(AuthService.getAuthToken(), 'groups').query().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.addGroup = function (description) {
            if (!AuthService.isLogged || !AuthService.allowedForbidden('teacher', 'admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService.getResource(AuthService.getAuthToken(), 'groups').post({
                description: description
            }).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.updateGroup = function (groupId, newDescription) {
            if (!AuthService.isLogged || !AuthService.allowedForbidden('teacher', 'admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService.getResource(AuthService.getAuthToken(), 'groups/:id')
                .put(
                    {id: groupId},
                    {description: newDescription})
                .$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.deleteGroup = function (groupId) {
            if (!AuthService.isLogged || !AuthService.allowedForbidden('teacher', 'admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService
                .getResource(AuthService.getAuthToken(), 'groups/:id')
                .delete({id: groupId})
                .$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.assignStudentToGroup = function (studentId, groupId) {
            if (!AuthService.isLogged || !AuthService.allowedForbidden('teacher', 'admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService
                .getResource(AuthService.getAuthToken(), 'groups/:groupId/student/:studentId')
                .put({
                    groupId: groupId,
                    studentId: studentId
                })
                .$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.removeStudentFromGroup = function (studentId, groupId) {
            if (!AuthService.isLogged || !AuthService.allowedForbidden('teacher', 'admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService
                .getResource(AuthService.getAuthToken(), 'groups/:groupId/student/:studentId')
                .delete({
                    groupId: groupId,
                    studentId: studentId
                })
                .$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };
    });
