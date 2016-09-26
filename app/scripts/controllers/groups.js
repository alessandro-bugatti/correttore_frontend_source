'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.controller:GroupsCtrl
 * @description
 * # GroupsCtrl
 * Controller of the frontendStableApp
 */
angular.module('frontendStableApp')
    .controller('GroupsCtrl', function (AuthService, GroupsService, $scope, $location, $routeParams, $log, $rootScope) {
        if (!AuthService.isLogged()) {
            $location.search({redirect: $location.path()});
            $location.path('/login');
            return;
        }

        if (!AuthService.atLeast('teacher')) {
            $location.path('/');
            $location.search({});
            return;
        }

        $scope.$location = $location;
        $scope.isTeacherOnly = AuthService.allowedForbidden('teacher', 'admin');

        $scope.deleteGroup = function (groupId, index) {
            if (!$scope.isTeacherOnly)
                return false;

            $rootScope.$emit('loading-start');
            $scope.groups.splice(index, 1);

            GroupsService.deleteGroup(groupId)
                .then(function () {
                    $rootScope.$emit('loading-stop');
                });
        };

        $scope.loading = true;
        $rootScope.$emit('loading-start');
        $scope.groupId = null;

        if ($routeParams.groupId) {
            if (!$scope.isTeacherOnly) {
                $location.path('/groups');
                return false;
            }

            $scope.groupId = $routeParams.groupId;

            $scope.group = {
                description: ''
            };

            if ($scope.groupId == 'new') {
                $scope.loading = false;
                $rootScope.$emit('loading-stop');
            } else {
                GroupsService.getList() // TODO: ci vorrebbe una chiamata per ottenere un singolo gruppo
                    .then(function (response) {
                        for (var i = 0; i < response.length; i++)
                            if (response[i].id == $scope.groupId)
                                $scope.group = response[i];

                        if (!$scope.group.description)
                            $location.path('/groups');

                        $scope.loading = false;
                        $rootScope.$emit('loading-stop');
                    });
            }

            $scope.save = function () {
                $rootScope.$emit('loading-start');
                if ($scope.groupId == 'new') {
                    GroupsService.addGroup($scope.group.description)
                        .then(function (response) {
                            $rootScope.$emit('loading-stop');
                            $location.path('/groups');
                        });
                } else {
                    GroupsService.updateGroup($scope.groupId, $scope.group.description)
                        .then(function (response) {
                            $rootScope.$emit('loading-stop');
                            $location.path('/groups');
                        });
                }
            }
        } else {
            $scope.groups = [];
            GroupsService.getList() // TODO: error handling
                .then(function (response) {
                    $scope.loading = false;
                    $rootScope.$emit('loading-stop');
                    $scope.groups = response;
                });
        }

        $scope.openGroup = function (groupId) {
            $rootScope.$emit('has-back'); // Mostra tasto indietro nella toolbar
            $location.path('/groups/' + groupId);
        }
    });
