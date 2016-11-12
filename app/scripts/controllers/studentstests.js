'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.controller:StudentsTestsCtrl
 * @description
 * # StudentsTestsCtrl
 * Controller of the frontendStableApp
 */
angular.module('frontendStableApp')
    .controller('StudentsTestsCtrl', function (AuthService, TestsService, $location, $rootScope, $scope, $q) {
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

        $scope.tests = [];
        TestsService.getList() // TODO: error handling
            .then(function (response) {
                $scope.loading = false;
                $rootScope.$emit('loading-stop');
                $scope.tests = response;

                var resultPromises = [];

                $scope.tests.forEach(function (e) {
                    console.log(e);
                    e.loadingResults = true;
                    resultPromises.push(
                        TestsService.getStudentResult(AuthService.getUserId(), e.id)
                    );
                });

                return $q.all(resultPromises);
            })
            .then(function (results) {
                $scope.tests.forEach(function (e, index) {
                    e.loadingResults = false;
                    e.results = results[index];
                });
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
