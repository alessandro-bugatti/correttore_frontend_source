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
        'ngMaterial'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
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
