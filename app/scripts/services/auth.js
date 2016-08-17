'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.service:AuthService
 * @description
 * # AuthService
 * Service of the frontendStableApp
 */
angular.module('frontendStableApp')
    .service('AuthService', function (ResourcesGeneratorService, $q, $window) {
        var authToken = $window.localStorage.getItem('authToken');
        var isLogged = false;
        var userRole = null;

        this.isLogged = function () {
            return isLogged;
        };

        this.getAuthToken = function () {
            return authToken;
        };

        this.login = function (username, password) {
            return ResourcesGeneratorService.getResource(null, 'login').save({
                username: username,
                password: password
            }).$promise
                .then(function (response) {
                    $window.localStorage.setItem('authToken', response.token);
                    authToken = response.token;
                    isLogged = true;

                    return response;
                }, function (error) {
                    $window.localStorage.removeItem('authToken');
                    authToken = null;
                    isLogged = false;

                    return $q.reject(error.data);
                });
        };

        this.logout = function () {
            if (!authToken || !isLogged)
                return $q.reject('null authToken');

            return ResourcesGeneratorService.getResource(authToken, 'logout').get().$promise
                .then(function (response) {
                    $window.localStorage.removeItem('authToken');
                    authToken = null;
                    isLogged = false;

                    return response;
                }, function (error) {
                    return $q.reject(error.data);
                });
        };

        this.getSessionInfo = function () {
            if (!authToken)
                return $q.reject('null authToken');

            return ResourcesGeneratorService.getResource(authToken, 'info').get().$promise
                .then(function (response) {
                    isLogged = true;

                    return response;
                }, function (error) {
                    isLogged = false;

                    return $q.reject(error.data);
                });
        };
    });
