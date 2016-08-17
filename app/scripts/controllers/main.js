'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendStableApp
 */
angular.module('frontendStableApp')
    .controller('MainCtrl', function (AuthService, GroupsService, $log) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        AuthService.getSessionInfo()
            .then(function () {
                return GroupsService.removeStudentFromGroup(2, 2);
            })
            .then(function () {
                console.log(arguments);
            })
            .catch(function (err) {
                $log.error(String(err));
            })
    });
