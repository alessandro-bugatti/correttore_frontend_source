'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendStableApp
 */
angular.module('frontendStableApp')
    .controller('MainCtrl', function (AuthService, TeachersService, $log) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        AuthService.getSessionInfo()
            .then(function () {
                $log.debug(AuthService.getRoleValue());
                $log.debug(AuthService.getRolesArray());
                $log.debug(AuthService.checkRole('student'));
                $log.debug(AuthService.atLeast('teacher'));
            })
            .then(function () {
                console.log(arguments);
            })
            .catch(function (err) {
                $log.error(String(err));
            })
    });
