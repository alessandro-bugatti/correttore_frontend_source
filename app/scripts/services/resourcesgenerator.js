'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.service:ResourcesGeneratorService
 * @description
 * # ResourcesGeneratorService
 * Service of the frontendStableApp
 */
angular.module('frontendStableApp')
    .service('ResourcesGeneratorService', function (Config, $resource, $q, $mdDialog, $rootScope) {
        var errors = {
            data: {
                'Not a valid request': 'Richiesta incompleta',
                'User not found': 'Credenziali errate o inesistenti',
                'Forbidden': 'Accesso negato',
                'Unauthorized': 'Sessione scaduta o permessi insufficienti',
                'category already exist': 'Esiste già una categoria con questo nominativo',
                'group already exist': 'Esiste già un gruppo con questo nominativo',
                'permission denied, user does not own this group': 'Il gruppo appartiene ad un altro utente',
                'group does not exist or description is duplicated': 'Gruppo da modificare non valido',
                'permission denied, user does not own this group or the group does not exist': 'Gruppo inesistente',
                'permission denied, user is not a student or the student does not exist': 'L\'utente selezionato non esiste',
                'Method not allowed by your role': 'Permessi insufficienti',
                'You don\'t own the task': 'Problema inesistente',
                'permission denied, user does not own this test': 'Test inesistente',
                'permission denied, user id is not correct': 'Studente inesistente',
                'test already exist': 'Esiste già un test con questo nominativo',
                'test does not exist or description is duplicated': 'Test da modificare non valido',
                'permission denied, user does not own this test or the test does not exist': 'Test inesistente',
                'permission denied, task is public or the task does not exist': 'Il problema è pubblico o inesistente',
                'permission denied, the task does not exist': 'Problema inesistente'
            },
            code: {
                409: 'Conflitto nella creazione della risorsa',
                404: 'Risorsa non trovata',
                403: 'Accesso negato',
                401: 'Permessi insufficienti per accedere alla risorsa'
            }
        };

        this.getResource = function (authToken, path) {
            var headersObj = {};
            headersObj[Config.getAuthTokenName()] = authToken;

            if (!authToken)
                return $resource(Config.getServerPath() + 'public/' + path);
            else
                return $resource(Config.getServerPath() + path, {}, {
                    'get': {method: 'GET', headers: headersObj},
                    'save': {method: 'POST', headers: headersObj},
                    'post': {method: 'POST', headers: headersObj},
                    'put': {
                        method: 'PUT', headers: headersObj, params: {
                            studentId: '@studentId',
                            groupId: '@groupId',
                            testId: '@testId',
                            taskId: '@taskId'
                        }
                    },
                    'query': {method: 'GET', isArray: true, headers: headersObj},
                    'remove': {method: 'DELETE', headers: headersObj},
                    'delete': {method: 'DELETE', headers: headersObj}
                });
        };

        this.successHandler = function (response) {
            return response;
        };

        this.failureHandler = function (error) {
            $rootScope.$emit('loading-stop');

            var errorString = null;
            if (error && error.data && error.data.error != undefined)
                errorString = errors.data[error.data.error];

            if (!errorString)
                errorString = errors.code[error.status];

            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Si è verificato un errore')
                    .textContent(errorString)
                    .ariaLabel('Messaggio di errore')
                    .ok('Chiudi')
                    .targetEvent($rootScope.getClickEvent())
                    .theme($rootScope.theme)
            );

            return $q.reject(errorString || error);
        }
    });
