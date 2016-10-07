'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.controller:TasksCtrl
 * @description
 * # TasksCtrl
 * Controller of the frontendStableApp
 */
angular.module('frontendStableApp')
    .controller('TasksCtrl', function (AuthService, TasksService, CategoriesService, $scope, $location, $routeParams, $log, $rootScope, $mdMedia, $mdTheming, $mdDialog) {
        if (!AuthService.isLogged()) {
            $location.search({redirect: $location.path()});
            $location.path('/login');
            return;
        }

        if (!$rootScope.theme)
            $rootScope.theme = $mdTheming.defaultTheme();
        $scope.currentThemeObj = $mdTheming.THEMES[$rootScope.theme];

        $scope.mdMedia = $mdMedia;

        $scope.categorie = [];
        $scope.loadingCategories = true;

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
                is_public: '0',
                level: 1,
                test_cases: 1,
                category_id: 0,
                description: null,
                solution: null,
                material: null
            };

            var loadCategories = function () {
                CategoriesService.getList().then(function (response) {
                    $scope.loadingCategories = false;
                    $scope.categorie = response;
                });
            };

            loadCategories();
            $scope.newCategory = function (ev) {

                var confirm = $mdDialog.prompt()
                    .title('Nuova categoria')
                    .textContent('Dai un nome alla nuova categoria')
                    .placeholder('Grafi')
                    .ariaLabel('Nuova Categoria')
                    .targetEvent(ev)
                    .theme($rootScope.theme)
                    .ok('Conferma')
                    .cancel('Annulla');
                $mdDialog.show(confirm)
                    .then(function (result) {
                        $scope.loadingCategories = true;
                        return CategoriesService.addCategory(result);
                    })
                    .then(function (result) {
                        $scope.loadingCategories = false;
                        $scope.task.category_id = result.id;
                        $scope.categorie.push(result);
                    }, function () {
                        $scope.loadingCategories = false;
                    });
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
                        $scope.task = JSON.parse(JSON.stringify(response)); // deep copy per evitare riferimenti circolari all'update

                        $scope.loading = false;
                        $rootScope.$emit('loading-stop');

                        $scope.task.test_cases = parseInt($scope.task.test_cases); // Fix per input[type=number]
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
                    $rootScope.$emit('loading-start');
                    TasksService.updateTask($scope.taskId, $scope.task)
                        .then(function (response) {
                            $rootScope.$emit('loading-stop');
                            //$location.path('/tasks'); TODO: facciamo il redirect?
                        });
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
            $rootScope.$emit('has-back'); // Mostra tasto indietro nella toolbar
            $location.path('/tasks/' + taskId);
        }
    });
