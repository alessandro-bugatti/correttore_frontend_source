'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.service:CategoriesService
 * @description
 * # CategoriesService
 * Service of the frontendStableApp
 */
angular.module('frontendStableApp')
    .service('CategoriesService', function (ResourcesGeneratorService, AuthService, $q) {
        this.getList = function () {
            return ResourcesGeneratorService.getResource(null, 'categories').query().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.addCategory = function (description) {
            if (!AuthService.isLogged || !AuthService.allowedForbidden('teacher', 'admin'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService.getResource(AuthService.getAuthToken(), 'categories').post({
                description: description
            }).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.getSingleCategory = function (categoryId) {
            if (!AuthService.isLogged || !AuthService.atLeast('teacher'))
                return $q.reject("User not logged in");

            return ResourcesGeneratorService.getResource(AuthService.getAuthToken(), 'categories/:id')
                .get(
                    {id: categoryId})
                .$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };
    });
