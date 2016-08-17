'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.directive:fileModel
 * @description
 * # fileModel
 * Directive of the frontendStableApp
 */
angular.module('frontendStableApp')
    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);
