'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.controller:TeachersCtrl
 * @description
 * # TeachersCtrl
 * Controller of the frontendStableApp
 */
angular.module('frontendStableApp')
    .controller('TeachersCtrl', function (AuthService, TeachersService, $scope, $location, $routeParams, $log, $rootScope) {
        if (!AuthService.isLogged()) {
            $location.search({redirect: $location.path()});
            $location.path('/login');
            return;
        }

        if (!AuthService.atLeast('admin')) {
            $location.path('/');
            $location.search({});
            return;
        }

        $scope.$location = $location;

        $scope.deleteTeacher = function (teacherId, index, event) {
            $rootScope.$emit('loading-start');
            $scope.teachers.splice(index, 1);

            TeachersService.deleteTeacher(teacherId)
                .then(function () {
                    $rootScope.$emit('loading-stop');
                });
        };

        $scope.loading = true;
        $rootScope.$emit('loading-start');
        $scope.teacherId = null;

        if ($routeParams.teacherId) {
            $scope.teacherId = $routeParams.teacherId;

            $scope.user = {
                name: '',
                surname: '',
                username: '',
                password: '',
                password2: ''
            };

            if ($scope.teacherId != 'new') {
                TeachersService.getOneTeacher($scope.teacherId)
                    .then(function (response) {
                        $scope.loading = false;
                        $rootScope.$emit('loading-stop');
                        $scope.user = response;
                    });
            } else {
                $scope.loading = false;
                $rootScope.$emit('loading-stop');
            }

            $scope.save = function () {
                $rootScope.$emit('loading-start');
                if ($scope.teacherId == 'new') {
                    TeachersService.addTeacher($scope.user.name, $scope.user.surname, $scope.user.username, $scope.user.password)
                        .then(function (response) {
                            $rootScope.$emit('loading-stop');
                            $location.path('/teachers');
                        });
                } else {
                    TeachersService.updateTeacher($scope.teacherId, $scope.user.name, $scope.user.surname, $scope.user.username, $scope.user.password)
                        .then(function (response) {
                            $rootScope.$emit('loading-stop');
                            $location.path('/teachers');
                        });
                }
            }
        } else {
            $scope.teachers = [];
            TeachersService.getList() // TODO: error handling
                .then(function (response) {
                    $scope.loading = false;
                    $rootScope.$emit('loading-stop');
                    $scope.teachers = response;
                });
        }

        $scope.openTeacher = function (teacherId) {
            $location.path('/teachers/' + teacherId);
        }
    });
