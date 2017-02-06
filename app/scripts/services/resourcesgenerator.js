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
                /* Errori generici */
                'Not a valid request': 'Richiesta incompleta',
                'User not found': 'Credenziali errate o inesistenti',
                'Forbidden': 'Accesso negato',
                'Unauthorized': 'Sessione scaduta o permessi insufficienti',
                'Method not allowed by your role': 'Permessi insufficienti',
                'Wrong role': 'Il tuo ruolo non permette quest\'azione',

                /* Categorie */
                'category already exist': 'Esiste già una categoria con questo nominativo',

                /* Gruppi */
                'group already exist': 'Esiste già un gruppo con questo nominativo',
                'permission denied, user does not own this group': 'Il gruppo appartiene ad un altro utente',
                'group does not exist or description is duplicated': 'Gruppo da modificare non valido',
                'permission denied, user does not own this group or the group does not exist': 'Gruppo inesistente',
                'permission denied, user is not a student or the student does not exist': 'L\'utente selezionato non esiste',

                /* Problemi */
                'You don\'t own the task': 'Problema inesistente',
                'permission denied, task is public or the task does not exist': 'Il problema è pubblico o inesistente',
                'permission denied, the task does not exist': 'Problema inesistente',
                'The user doesn\'t own the task': 'Problema inesistente',
                'The task doesn\'t exist': 'Problema inesistente',


                /* Verifiche */
                'permission denied, user does not own this test': 'Test inesistente',
                'permission denied, user id is not correct': 'Studente inesistente',
                'test already exist': 'Esiste già un test con questo nominativo',
                'test does not exist or description is duplicated': 'Test da modificare non valido',
                'permission denied, user does not own this test or the test does not exist': 'Test inesistente',

                /* Sottomissione */
                'Task does not exist': 'Problema inesistente',
                'Task is not public': 'Il problema è privato',
                'Task is public': 'Il problema è pubblico',
                'There is not the submitted file': 'Codice sorgente mancante',
                'Only students can submit solutions': 'Solo gli studenti possono sottomettere una soluzione',
                'This task is not in the current test': 'Il problema non appartiene ad una verifica',
                'The test is no longer available': 'La verifica è conclusa',
                'Only teachers can submit solutions': 'Solo gli insegnati possono ottenere i risultati',
                'Solution not found': 'Soluzione non trovata'
            },
            code: {
                409: 'Conflitto nella creazione della risorsa',
                404: 'Risorsa non trovata',
                403: 'Accesso negato',
                401: 'Permessi insufficienti per accedere alla risorsa',
                400: 'Parametri mancanti'
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
