'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.controller:TestsCtrl
 * @description
 * # TestsCtrl
 * Controller of the frontendStableApp
 */
angular.module('frontendStableApp')
    .controller('TestsCtrl', function (AuthService, TestsService, TasksService, $scope, Config, $window, $interval, $location, $routeParams, $log, $rootScope, $q, $mdDialog, $mdMedia) {
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
                return query ?
                    $scope.tasks.filter(function (e) {
                        if (e.is_public != "0") // non pubblico
                            return false;

                        var duplicato = self.testTasks.some(function (x) {
                            return x.title == e.title;
                        });

                        if (duplicato)
                            return false;

                        var title = e.title.toLowerCase();
                        return title.lastIndexOf(query.toLowerCase(), 0) === 0; // startsWith
                    }) : [];
            };

            if ($scope.testId == 'new') {
                $scope.loading = false;
                $rootScope.$emit('loading-stop');
            } else {
                $scope.risultati = [];
                $scope.loadingResults = false;
                $scope.loadingTicks = 0;
                $scope.resultsInterval = null;

                var doResultsCall = function () {
                    $scope.loadingResults = true;
                    TestsService.getClassResults($scope.testId).then(function (response) {
                        $scope.risultati = response;
                        $scope.loadingTicks = 0;
                        $scope.loadingResults = false;
                    });
                };

                $scope.loadResults = function () {
                    if ($scope.resultsInterval)
                        $interval.cancel($scope.resultsInterval);

                    doResultsCall();
                    $scope.resultsInterval = $interval(function () {
                        if ($scope.loadingResults) return;

                        if ($scope.loadingTicks >= 100) doResultsCall();
                        else $scope.loadingTicks++;
                    }, Config.getTestResultsReloadInterval() / 100);
                };


                $scope.loadingCSV = false;
                $scope.downloadCSV = function () {
                    $scope.loadingCSV = true;
                    TestsService.getClassCSVResults($scope.testId)
                        .then(function (fileURL) {
                            var a = document.getElementById('fileDownload');
                            a.href = fileURL;
                            a.download = $scope.test.description + '.csv';
                            a.click();

                            $window.URL.revokeObjectURL(fileURL);
                            $scope.loadingCSV = false;
                        });
                };

                TestsService.getList() // TODO: ci vorrebbe una chiamata per ottenere un singolo test
                    .then(function (response) {
                        for (var i = 0; i < response.length; i++)
                            if (response[i].id == $scope.testId)
                                $scope.test = response[i];

                        if (!$scope.test.description) {
                            $location.path('/tests');
                            return $q.reject('Invalid testId');
                        }

                        return $q.all([
                            TestsService.getTasks($scope.testId),
                            TasksService.getList()
                        ]);
                    })
                    .then(function (responses) {
                        var testTasks = responses[0];
                        var tasksList = responses[1];

                        self.testTasks = testTasks;
                        originalTestTasks = JSON.parse(JSON.stringify(testTasks)); // Deep copy

                        $scope.tasks = tasksList;

                        $scope.loading = false;
                        $rootScope.$emit('loading-stop');

                        if ($scope.test.is_on == '1')
                            $scope.loadResults();
                    });

                $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm'); // TODO: portare nel rootScope insieme al watch
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

                $scope.openRisultatiStudente = function (studenteId, testId, score, fullName, event) {
                    var result = {};

                    $mdDialog.show({
                        controller: 'DialogCtrl',
                        templateUrl: 'views/taskresult.html',
                        parent: angular.element(document.body),
                        targetEvent: event,
                        clickOutsideToClose: true,
                        fullscreen: useFullScreen,
                        locals: {
                            items: {
                                rootScope: $rootScope,
                                result: result,
                                score: score,
                                fullName: fullName
                            }
                        }
                    });

                    TestsService.getStudentResult(studenteId, testId)
                        .then(function (response) {
                            result.data = response;

                        })
                };

                $scope.$watch(function () {
                    return $mdMedia('xs') || $mdMedia('sm');
                }, function (wantsFullScreen) {
                    $scope.customFullscreen = (wantsFullScreen === true);
                });
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

                    var resultsPromises = [];

                    $scope.tests.forEach(function (t) {
                        t.loadingResults = true;
                        resultsPromises.push(
                            TestsService.getClassResults(t.id)
                        );
                    });

                    return $q.all(resultsPromises);
                })
                .then(function (testResults) {
                    testResults.forEach(function (results, index) {
                        $scope.tests[index].loadingResults = false;
                        $scope.tests[index].results = results;
                    });
                });
        }

        $scope.openTest = function (testId) {
            $rootScope.$emit('has-back'); // Mostra tasto indietro nella toolbar
            $location.path('/tests/' + testId);
        }
    });
