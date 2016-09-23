'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.controller:TasksCtrl
 * @description
 * # TasksCtrl
 * Controller of the frontendStableApp
 */
angular.module('frontendStableApp')
    .controller('TasksCtrl', function (AuthService, TasksService, $scope, $location, $routeParams, $log, $rootScope, $mdMedia) {
        if (!AuthService.isLogged()) {
            $location.search({redirect: $location.path()});
            $location.path('/login');
            return;
        }

        $scope.mdMedia = $mdMedia;

        $scope.categorie = [
            {id: 0, name: 'I/O'},
            {id: 1, name: 'Ordinamento'},
            {id: 2, name: 'Grafi'}
        ];

        if (!AuthService.atLeast('teacher')) {
            $location.path('/');
            $location.search({});
            return;
        }

        $scope.$location = $location;
        $scope.isTeacherOnly = AuthService.allowedForbidden('teacher', 'admin');

        $scope.deleteTask = function (taskId, index) {
            if (!$scope.isTeacherOnly)
                return false;

            $rootScope.$emit('loading-start');
            $scope.tasks.splice(index, 1);

            TasksService.deleteTask(taskId)
                .then(function () {
                    $rootScope.$emit('loading-stop');
                });
        };

        $scope.loading = true;
        $rootScope.$emit('loading-start');
        $scope.taskId = null;

        if ($routeParams.taskId) {
            $scope.taskId = $routeParams.taskId;

            if ($scope.taskId == 'new' && !$scope.isTeacherOnly) {
                $location.path('/tasks');
                return false;
            }

            $scope.task = {
                title: '',
                short_title: '',
                is_public: false,
                level: 1,
                test_cases: 1,
                category_id: 0, //FIXME: link per scaricare le categorie o lista
                description: null,
                solution: null,
                material: null
            };

            $scope.setFile = function (fileName, file) {
                $scope.task[fileName] = file[0];
            };

            if ($scope.taskId == 'new') {
                $scope.loading = false;
                $rootScope.$emit('loading-stop');
            } else {
                TasksService.getOneTask($scope.taskId)
                    .then(function (response) {
                        $scope.task = response;

                        $scope.loading = false;
                        $rootScope.$emit('loading-stop');

                        $scope.task.test_cases = parseInt($scope.task.test_cases); // Fix per input[type=number]
                        $scope.task.is_public = !!$scope.task.is_public; // Fix per checkbox
                    }, function (error) {
                        $location.path('/tasks');
                    });
            }

            $scope.save = function () {
                $rootScope.$emit('loading-start');
                if ($scope.taskId == 'new') {
                    TasksService.addTask($scope.task)
                        .then(function (response) {
                            $rootScope.$emit('loading-stop');
                            $location.path('/tasks');
                        });
                } else {
                    // TODO: update
                }
            }
        } else {
            $scope.tasks = [];
            TasksService.getList() // TODO: error handling
                .then(function (response) {
                    $scope.loading = false;
                    $rootScope.$emit('loading-stop');
                    $scope.tasks = response;
                });
        }

        $scope.openTask = function (taskId) {
            $location.path('/tasks/' + taskId);
        }
    });
