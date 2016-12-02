'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.controller:StudentsCtrl
 * @description
 * # StudentsCtrl
 * Controller of the frontendStableApp
 */
angular.module('frontendStableApp')
    .controller('StudentsCtrl', function (AuthService, StudentsService, $scope, $location, $routeParams, $log, $rootScope) {
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

        $scope.$location = $location;

        $scope.deleteStudent = function (studentId, index, event) {
            $rootScope.$emit('loading-start');
            $scope.students.splice(index, 1);

            StudentsService.deleteStudent(studentId)
                .then(function () {
                    $rootScope.$emit('loading-stop');
                });
        };

        $scope.loading = true;
        $rootScope.$emit('loading-start');
        $scope.studentId = null;

        if ($routeParams.studentId) {
            $scope.studentId = $routeParams.studentId;

            $scope.user = {
                name: '',
                surname: '',
                username: '',
                password: '',
                password2: ''
            };

            if ($scope.studentId == 'new') {
                $scope.loading = false;
                $rootScope.$emit('loading-stop');
            } else {
                StudentsService.getOneStudent($scope.studentId)
                    .then(function (response) {
                        $scope.loading = false;
                        $rootScope.$emit('loading-stop');
                        $scope.user = response;
                    });
            }

            $scope.save = function () {
                $rootScope.$emit('loading-start');
                if ($scope.studentId == 'new') {
                    StudentsService.addStudent($scope.user.name, $scope.user.surname, $scope.user.username, $scope.user.password)
                        .then(function (response) {
                            $rootScope.$emit('loading-stop');
                            $location.path('/students');
                        });
                } else {
                    StudentsService.updateStudent($scope.studentId, $scope.user.name, $scope.user.surname, $scope.user.username, $scope.user.password)
                        .then(function (response) {
                            $rootScope.$emit('loading-stop');
                            $location.path('/students');
                        });
                }
            }
        } else {
            $scope.students = [];
            StudentsService.getList() // TODO: error handling
                .then(function (response) {
                    $scope.loading = false;
                    $rootScope.$emit('loading-stop');
                    $scope.students = response;
                });
        }

        $scope.openStudent = function (studentId) {
            $rootScope.$emit('has-back'); // Mostra tasto indietro nella toolbar
            $location.path('/students/' + studentId);
        }
    });
