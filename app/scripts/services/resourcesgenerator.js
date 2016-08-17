'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.service:ResourcesGeneratorService
 * @description
 * # ResourcesGeneratorService
 * Service of the frontendStableApp
 */
angular.module('frontendStableApp')
    .service('ResourcesGeneratorService', function (Config, $resource, $q) {
        this.getResource = function (authToken, path) {
            var headersObj = {};
            headersObj[Config.getAuthTokenName()] = authToken;

            if (!authToken)
                return $resource(Config.getServerPath() + 'public/' + path);
            else
                return $resource(Config.getServerPath() + path, {}, {
                    'get': {method: 'GET', headers: headersObj},
                    'save': {method: 'POST', headers: headersObj},
                    'post': {method: 'POST', headers: headersObj},
                    'put': {method: 'PUT', headers: headersObj},
                    'query': {method: 'GET', isArray: true, headers: headersObj},
                    'remove': {method: 'DELETE', headers: headersObj},
                    'delete': {method: 'DELETE', headers: headersObj}
                });
        };

        this.successHandler = function (response) {
            return response;
        };

        this.failureHandler = function (error) {
            return $q.reject(error.data);
        }
    });
