'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.controller:TestsCtrl
 * @description
 * # TestsCtrl
 * Controller of the frontendStableApp
 */
angular.module('frontendStableApp')
    .controller('TestsCtrl', function (AuthService, TestsService, TasksService, $scope, $location, $routeParams, $log, $rootScope, $q) {
        if (!AuthService.isLogged()) {
            $location.search({redirect: $location.path()});
            $location.path('/login');
            return;
        }

        if (!AuthService.atLeast('teacher') || AuthService.atLeast('admin')) {
            $location.path('/');
            $location.search({});
            return;
        }

        var self = this;
        $scope.$location = $location;

        var originalTestTasks = [];
        self.testTasks = [];

        $scope.deleteTest = function (testId, index) {
            $rootScope.$emit('loading-start');
            $scope.tests.splice(index, 1);

            TestsService.deleteTest(testId)
                .then(function () {
                    $rootScope.$emit('loading-stop');
                });
        };

        $scope.loading = true;
        $rootScope.$emit('loading-start');
        $scope.testId = null;

        if ($routeParams.testId) {
            $scope.testId = $routeParams.testId;

            $scope.test = {
                description: '',
                is_on: '0',
                tasks: self.testTasks
            };

            $scope.tasks = [];
            $scope.selectedItem = null;
            $scope.searchText = null;

            $scope.transformChip = function (chip) { // FIXME: togliere
                return chip;
            };

            $scope.querySearch = function (query) {
                return query ? $scope.tasks.filter(function (e) {
                    var title = e.title.toLowerCase();
                    return title.lastIndexOf(query.toLowerCase(), 0) === 0; // startsWith
                }) : [];
            };

            if ($scope.testId == 'new') {
                $scope.loading = false;
                $rootScope.$emit('loading-stop');
            } else {
                TestsService.getList() // TODO: ci vorrebbe una chiamata per ottenere un singolo gruppo
                    .then(function (response) {
                        for (var i = 0; i < response.length; i++)
                            if (response[i].id == $scope.testId)
                                $scope.test = response[i];

                        if (!$scope.test.description) {
                            $location.path('/tests');
                            return $q.reject('Invalid testId');
                        }

                        return TestsService.getTasks($scope.testId);
                    })
                    .then(function (response) {
                        $log.debug(response);
                        self.testTasks = response;
                        originalTestTasks = JSON.parse(JSON.stringify(response)); // Deep copy

                        return TasksService.getList();
                    })
                    .then(function (response) {
                        $scope.tasks = response;

                        $scope.loading = false;
                        $rootScope.$emit('loading-stop');
                    })
            }

            $scope.save = function () {
                $rootScope.$emit('loading-start');
                if ($scope.testId == 'new') {
                    TestsService.addTest($scope.test.description)
                        .then(function (response) {
                            $rootScope.$emit('loading-stop');
                            $location.path('/tests');
                        });
                } else {
                    var modificheTasks = [];

                    // Visto che sono pochi non perdo tempo ad ottimizzare l'O(N^2)

                    self.testTasks.forEach(function (e) { // cerco gli aggiunti
                        var aggiunto = !originalTestTasks.some(function (x) {
                            return x.title == e.title;
                        });

                        if (aggiunto)
                            modificheTasks.push(TestsService.assignTaskToTest(e.id, $scope.testId));
                    });

                    originalTestTasks.forEach(function (e) { // cerco i tolti
                        var tolto = !self.testTasks.some(function (x) {
                            return x.title == e.title;
                        });

                        if (tolto)
                            modificheTasks.push(TestsService.removeTaskFromTest(e.id, $scope.testId));
                    });

                    $q.all(modificheTasks)
                        .then(function () {
                            return TestsService.updateTest($scope.testId, $scope.test);
                        })
                        .then(function (response) {
                            $rootScope.$emit('loading-stop');
                            $location.path('/tests');
                        });
                }
            }
        } else {
            $scope.tests = [];
            TestsService.getList() // TODO: error handling
                .then(function (response) {
                    $scope.loading = false;
                    $rootScope.$emit('loading-stop');
                    $scope.tests = response;
                });
        }

        $scope.openTest = function (testId) {
            $rootScope.$emit('has-back'); // Mostra tasto indietro nella toolbar
            $location.path('/tests/' + testId);
        }
    });
