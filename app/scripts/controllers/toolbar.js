'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.controller:ToolbarCtrl
 * @description
 * # ToolbarCtrl
 * Controller of the frontendStableApp
 */
angular.module('frontendStableApp')
    .controller('ToolbarCtrl', function ($scope, $mdSidenav, $rootScope) {
        $scope.openSidenav = function () {
            $mdSidenav('left').open();
        };

        $scope.hide = false;
        $scope.loading = false;

        $rootScope.$on('toolbar-hide', function () {
            $scope.hide = true;
        });

        $rootScope.$on('toolbar-toggle', function () {
            $scope.hide = !$scope.hide;
        });

        $rootScope.$on('toolbar-show', function () {
            $scope.hide = false;
        });

        $rootScope.$on('loading-start', function () {
            $scope.loading = true;
        });

        $rootScope.$on('loading-stop', function () {
            $scope.loading = false;
        });

        $rootScope.$on('loading-toggle', function () {
            $scope.loading = !$scope.loading;
        });
    });
