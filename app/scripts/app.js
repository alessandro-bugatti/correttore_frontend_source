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
        'ngMaterial',
        'ngFileUpload'
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
            .when('/teachers/:teacherId?', {
                templateUrl: 'views/teachers.html',
                controller: 'TeachersCtrl'
            })
            .when('/groups/:groupId?', {
                templateUrl: 'views/groups.html',
                controller: 'GroupsCtrl'
            })
            .when('/tasks/:taskId?', {
                templateUrl: 'views/tasks.html',
                controller: 'TasksCtrl'
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
