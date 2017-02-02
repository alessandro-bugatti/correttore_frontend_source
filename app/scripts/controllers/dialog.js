'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.controller:DialogCtrl
 * @description
 * # DialogCtrl
 * Controller of the frontendStableApp
 */
angular.module('frontendStableApp')
    .controller('DialogCtrl', function ($scope, $mdDialog, items) {
        $scope.close = function () {
            $mdDialog.cancel();
        };

        for (var key in items)
            if (items.hasOwnProperty(key))
                $scope[key] = items[key];
    });
