'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.filter:roleFormatter
 * @description
 * # roleFormatter
 * Filter of the frontendStableApp
 */
angular.module('frontendStableApp')
    .filter('roleFormatter', function () {
        return function (input) {
            if (typeof input === 'string')
                switch (input) {
                    case 'admin':
                        return 'Amministratore';
                    case 'teacher':
                        return 'Docente';
                    case 'student':
                        return 'Studente';
                }

            return '';
        };
    });
