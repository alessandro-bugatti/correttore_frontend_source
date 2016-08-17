'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendStableApp
 */
angular.module('frontendStableApp')
    .controller('MainCtrl', function (AuthService, TasksService, $log) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        AuthService.getSessionInfo()
            .then(function () {
                console.log(arguments);
            })
            .catch(function (err) {
                $log.error(String(err));
            })
    });
