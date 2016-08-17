'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendStableApp
 */
angular.module('frontendStableApp')
    .controller('MainCtrl', function (AuthService, TeachersService) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        AuthService.getSessionInfo()
            .then(function () {
                return TeachersService.deleteTeacher(11);
            })
            .then(function () {
                console.log(arguments[0]);
            }, function () {
                console.error(arguments[0]);
            })
    });
