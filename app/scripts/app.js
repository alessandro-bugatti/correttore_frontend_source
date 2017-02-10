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
            .when('/problems/:problemId?/:testId?', {
                templateUrl: 'views/problems.html',
                controller: 'ProblemsCtrl'
            })
            .when('/tests/:testId?', {
                templateUrl: 'views/tests.html',
                controller: 'TestsCtrl',
                controllerAs: 'ctrl'
            })
            .when('/studentstests', {
                templateUrl: 'views/studentstests.html',
                controller: 'StudentsTestsCtrl'
            })
            .when('/students/:studentId?', {
                templateUrl: 'views/students.html',
                controller: 'StudentsCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('guest')
            .primaryPalette('light-green')
            .accentPalette('deep-orange')
            .warnPalette('pink')
            .dark();

        $mdThemingProvider.theme('student')
            .primaryPalette('amber')
            .accentPalette('cyan')
            .warnPalette('pink')
            .dark();

        $mdThemingProvider.theme('teacher')
            .primaryPalette('blue')
            .accentPalette('deep-orange')
            .warnPalette('amber');

        $mdThemingProvider.theme('admin')
            .primaryPalette('green')
            .accentPalette('indigo')
            .warnPalette('amber');

        $mdThemingProvider.setDefaultTheme('guest');
        $mdThemingProvider.alwaysWatchTheme(true);
    })
    .config(function (ConfigProvider) {
        ConfigProvider.serverVersion = 'v1';
        ConfigProvider.serverHost = 'https://auth-silex-test-alessandro-bugatti.c9users.io';
        ConfigProvider.authTokenName = 'x-authorization-token';
        ConfigProvider.testResultsReloadInterval = 8000;
    });
