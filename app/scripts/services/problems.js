'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.service:ProblemsService
 * @description
 * # ProblemsService
 * Service of the frontendStableApp
 */
angular.module('frontendStableApp')
    .service('ProblemsService', function (ResourcesGeneratorService, Upload, Config, AuthService, $sce, $http) {
        this.getList = function () {
            return ResourcesGeneratorService.getResource(null, 'problems').query().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.getOneProblem = function (problemId) {
            return ResourcesGeneratorService.getResource(null, 'problems/:id').get({id: problemId}).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.getPDF = function (problemId) {
            return $http.get(Config.getServerPath() + 'public/problems/' + problemId + '.pdf', {responseType: 'arraybuffer'})
                .then(function (response) {
                    var file = new Blob([response.data], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);
                    return $sce.trustAsResourceUrl(fileURL);
                }, ResourcesGeneratorService.failureHandler);
        };
    });
