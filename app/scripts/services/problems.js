'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.service:ProblemsService
 * @description
 * # ProblemsService
 * Service of the frontendStableApp
 */
angular.module('frontendStableApp')
    .service('ProblemsService', function (ResourcesGeneratorService, Upload, Config, AuthService, $sce, $http, $q) {
        this.getList = function () {
            return ResourcesGeneratorService.getResource(null, 'problems').query().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        var anonSubmission = function (problemId, sourceFile) {
            return Upload.upload({
                url: Config.getServerPath() + 'public/submissions/' + problemId,
                data: {submission: sourceFile}
            })
                .then(ResourcesGeneratorService.successHandler, null, function (evt) {
                }); // FIXME: usare progresso
        };

        var userSubmission = function (problemId, sourceFile) {
            if (!AuthService.isLogged)
                return $q.reject("User not logged in");

            var headersObj = {};
            headersObj[Config.getAuthTokenName()] = AuthService.getAuthToken();

            return Upload.upload({
                url: Config.getServerPath() + 'public/submissions/' + problemId,
                headers: headersObj,
                data: {submission: sourceFile}
            })
                .then(ResourcesGeneratorService.successHandler, null, function (evt) {
                }); // FIXME: usare progresso
        };

        this.submitFile = function (problemId, sourceFile) {
            if (!AuthService.isLogged())
                return anonSubmission(problemId, sourceFile);
            return userSubmission(problemId, sourceFile);
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

        this.testGetOneProblem = function (problemId) {
            if (!AuthService.isLogged || !AuthService.atLeast('student') || AuthService.atLeast('teacher')) // Permesso solo agli studenti (sudent <= user < teacher)
                return $q.reject("User not logged in");

            return ResourcesGeneratorService.getResource(AuthService.getAuthToken(), 'problems/:id').get({id: problemId}).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.testGetPDF = function (problemId) {
            if (!AuthService.isLogged || !AuthService.atLeast('student')) // <= teacher
                return $q.reject("User not logged in");

            return $http.get(Config.getServerPath() + 'problems/' + problemId + '.pdf', {
                responseType: 'arraybuffer',
                headers: {
                    'X-Authorization-Token': AuthService.getAuthToken()
                }
            })
                .then(function (response) {
                    var file = new Blob([response.data], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);
                    return $sce.trustAsResourceUrl(fileURL);
                }, ResourcesGeneratorService.failureHandler);
        };

        this.testSubmitFile = function (taskId, testId, sourceFile) {
            if (!AuthService.isLogged || !AuthService.atLeast('student') || AuthService.atLeast('teacher')) // Permesso solo agli studenti (sudent <= user < teacher)
                return $q.reject("User not logged in");

            var headersObj = {};
            headersObj[Config.getAuthTokenName()] = AuthService.getAuthToken();

            return Upload.upload({
                url: Config.getServerPath() + 'submissions/tests/' + testId + '/tasks/' + taskId,
                headers: headersObj,
                data: {submission: sourceFile}
            })
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler, function (evt) {
                }); // FIXME: usare progresso
        };
    });
