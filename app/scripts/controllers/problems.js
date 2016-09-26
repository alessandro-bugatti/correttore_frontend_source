'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.controller:ProblemsCtrl
 * @description
 * # ProblemsCtrl
 * Controller of the frontendStableApp
 */
angular.module('frontendStableApp')
    .controller('ProblemsCtrl', function (AuthService, ProblemsService, $scope, $location, $routeParams, $log, $rootScope, $mdMedia, $mdTheming) {
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

        if ($routeParams.problemId) {
            $scope.problemId = $routeParams.problemId;

            $scope.problem = {
                title: '',
                short_title: '',
                level: 0,
                pdf: null,
                sourceFile: null
            };

            $scope.setFile = function (fileName, file) {
                $scope.problem[fileName] = file[0];
            };

            ProblemsService.getOneProblem($scope.problemId) // TODO: error handling
                .then(function (response) {
                    $scope.problem = response;
                    $scope.loading = false;
                    $rootScope.$emit('loading-stop');

                    return ProblemsService.getPDF($scope.problemId);
                }, function (error) {
                    $location.path('/problems');
                })
                .then(function (response) {
                    $scope.problem.pdf = response;
                    $scope.pdfLoading = false;
                }, function (error) {
                    $scope.pdfLoading = false;
                    $log.error(error);
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
        }
    });
