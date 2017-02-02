'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendStableApp
 */
angular.module('frontendStableApp')
    .controller('MainCtrl', function (AuthService, $location) {
        if (!AuthService.isLogged())
            $location.path('/login');
    });
