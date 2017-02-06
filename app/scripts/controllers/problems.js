'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.controller:ProblemsCtrl
 * @description
 * # ProblemsCtrl
 * Controller of the frontendStableApp
 */
angular.module('frontendStableApp')
    .controller('ProblemsCtrl', function (AuthService, ProblemsService, TestsService, ProblemsParserService, $scope, $timeout, $location, $routeParams, $log, $rootScope, $mdMedia, $mdTheming, $mdDialog, $q) {
        if ((!AuthService.isLogged() && AuthService.getAuthToken()) || !AuthService.getLoginResponse().username) {
            $location.search({redirect: $location.path()});
            $location.path('/login');
            return;
        }

        if (!$rootScope.theme)
            $rootScope.theme = $mdTheming.defaultTheme();
        $scope.currentThemeObj = $mdTheming.THEMES[$rootScope.theme];

        $scope.mdMedia = $mdMedia;
        $scope.$location = $location;

        $scope.loading = true;
        $scope.pdfLoading = true;
        $rootScope.$emit('loading-start');
        $scope.problemId = null;
        $scope.testObject = null;
        $scope.loadingSubmission = false;

        if ($routeParams.problemId) {
            $scope.problemId = $routeParams.problemId;
            $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
            $scope.problem = {
                title: '',
                short_title: '',
                level: 0,
                pdf: null,
                sourceFile: null
            };

            var openSubmissionDetailsDialog = function (ev, score, lines) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $rootScope.customFullscreen;
                $mdDialog.show({
                    controller: 'DialogCtrl',
                    templateUrl: 'views/submissiondetails.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    locals: {
                        items: {
                            rootScope: $rootScope,
                            score: score,
                            lines: lines
                        }
                    }
                });
            };

            $scope.submit = function (ev) {
                var problemFile = $scope.problem.sourceFile;

                $scope.problem.sourceFile = null;
                $scope.loadingSubmission = true;

                var submissionPromise = null;
                if ($routeParams.testId)
                    submissionPromise = ProblemsService.testSubmitFile($scope.problemId, $routeParams.testId, problemFile);
                else
                    submissionPromise = ProblemsService.submitFile($scope.problemId, problemFile);

                submissionPromise
                    .then(function (response) {
                        var score = parseFloat(response.data.score);
                        var lines = response.data.lines; // TODO: parse

                        $scope.loadingSubmission = false;

                        openSubmissionDetailsDialog(ev, score, lines);
                    }, function (error) { // TODO: error handling
                        $log.warn(error);
                        $scope.openCompilationWarningDiaog(error, ev);
                        $scope.loadingSubmission = false;
                    });
            };

            $scope.setFile = function (fileName, file) {
                $scope.problem[fileName] = file[0];
            };

            var promisesArray = [];
            if ($routeParams.testId) {
                promisesArray.push(ProblemsService.testGetOneProblem($scope.problemId));
                promisesArray.push(TestsService.getList());
                promisesArray.push(TestsService.getTasks($routeParams.testId));
            } else {
                promisesArray.push(ProblemsService.getOneProblem($scope.problemId));
            }
            var filterTestObject = function (testList) {
                if (typeof testList != 'object' || testList.length == 0)
                    return null;

                return testList.filter(function (e) {
                    return e.id == $routeParams.testId;
                })[0];
            };

            $q.all(promisesArray) // TODO: error handling
                .then(function (response) {
                    var testList = response[1],
                        testTasks = response[2];

                    $scope.problem = response[0];
                    $scope.loading = false;
                    $rootScope.$emit('loading-stop');

                    if ($routeParams.testId) {
                        $scope.testObject = filterTestObject(testList || []);

                        var taskPresent = (testTasks || []).filter(function (e) {
                                return e.id == $scope.problemId;
                            }).length > 0;

                        if (!$scope.testObject || !taskPresent)
                            return $q.reject("Verifica non valida");

                        return ProblemsService.testGetPDF($scope.problemId);
                    } else
                        return ProblemsService.getPDF($scope.problemId);
                })
                .then(function (response) {
                    $scope.problem.pdf = response;
                    $scope.pdfLoading = false;
                }, function (error) {
                    $scope.pdfLoading = false;
                    $log.error(error);
                    if ($routeParams.testId)
                        $location.path("/tests/" + $routeParams.testId);
                });

        } else {
            $scope.problems = [];
            ProblemsService.getList() // TODO: error handling
                .then(function (response) {
                    $scope.loading = false;
                    $rootScope.$emit('loading-stop');
                    $scope.problems = response;
                });
        }

        $scope.openProblem = function (problemId) {
            $rootScope.$emit('has-back'); // Mostra tasto indietro nella toolbar
            $location.path('/problems/' + problemId);
        };

        $scope.openCompilationWarningDiaog = function (error, ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $rootScope.customFullscreen;

            $mdDialog.show({
                controller: 'DialogCtrl',
                templateUrl: 'views/compileroutput.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    items: {
                        compilerOutput: error.data.replace(/(.*)Compilation errors or warnings:/, ''),
                        rootScope: $rootScope
                    }
                }
            });
        };
    });
