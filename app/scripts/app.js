'use strict';

/**
 * @ngdoc overview
 * @name frontendStableApp
 * @description
 * # frontendStableApp
 *
 * Main module of the application.
 */
angular
    .module('frontendStableApp', [
        'ngAnimate',
        'ngAria',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .config(function (ConfigProvider) {
        ConfigProvider.serverVersion = 'v1';
        ConfigProvider.serverHost = 'https://auth-silex-test-alessandro-bugatti.c9users.io';
        ConfigProvider.authTokenName = 'x-authorization-token';
    });
