'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.filter:fileSizeFormatter
 * @description
 * # fileSizeFormatter
 * Filter of the frontendStableApp
 */
angular.module('frontendStableApp')
    .filter('fileSizeFormatter', function () {
        return function (input) {
            if (typeof input == 'number') {
                if (input < 1024)
                    return input + 'B';
                if (input < 1048576)
                    return (input / 1024).toFixed(2) + 'KB';

                return (input / 1048576).toFixed(2) + 'MB'; // Non penso andremo oltre il MB..
            }

            return '';
        };
    });
