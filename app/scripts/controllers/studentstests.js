'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.controller:StudentsTestsCtrl
 * @description
 * # StudentsTestsCtrl
 * Controller of the frontendStableApp
 */
angular.module('frontendStableApp')
    .controller('StudentsTestsCtrl', function (AuthService, TestsService, $location, $rootScope, $scope, $timeout) {
        if (!AuthService.isLogged()) {
            $location.search({redirect: $location.path()});
            $location.path('/login');
            return;
        }

        if (!AuthService.atLeast('student') || AuthService.atLeast('teacher')) { // Permesso solo agli studenti (sudent <= user < teacher)
            $location.path('/');
            $location.search({});
            return;
        }

        $scope.$location = $location;
        $scope.theme = $rootScope.theme;

        $scope.loading = true;
        $rootScope.$emit('loading-start');
        $scope.testId = null;

        $scope.tests = [];
        TestsService.getList() // TODO: error handling
            .then(function (response) {
                $scope.loading = false;
                $rootScope.$emit('loading-stop');
                $scope.tests = response;
            });

        $scope.tasksForTest = {};

        $scope.loadTasks = function (testId, event, callback) {
            if (!$scope.tasksForTest[testId]) {
                TestsService.getTasks(testId)
                    .then(function (response) {
                        $scope.tasksForTest[testId] = response;
                    });
            }

            callback(event);
        };

        $scope.openTask = function (testId, taskId) {
            $rootScope.$emit('has-back'); // Mostra tasto indietro nella toolbar
            $location.path('/problems/' + taskId + "/" + testId);
        }
    });
