'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.service:AuthService
 * @description
 * # AuthService
 * Service of the frontendStableApp
 */
angular.module('frontendStableApp')
    .service('AuthService', function (ResourcesGeneratorService, $q, $window) {
        var authToken = $window.localStorage.getItem('authToken');
        var isLogged = false;
        var userRole = 0;

        var that = this;

        /*
         * Credo sia una cosa molto "vecchio stile" ma mi sembra interessante e penso possa dare dei vantaggi nel confronto
         * dei ruoli (dato che vengono trattati come numeri e quindi come entità paragonabili naturalmente). Ad esempio,
         * in una funzione posso fare un controllo e verificare che il tuo ruolo sia > student, dando l'accesso a admin e teacher.
         * Altrimenti avrei dovuto fare un controllo del tipo "ruolo != student" oppure "ruolo == teacher || ruolo == admin".
         * Nel primo caso, aggiungendo un nuovo ruolo si rischiano anche problemi di sicurezza (un ipotetico "guest",
         * con meno privilegi di uno student, avrebbe accesso alle chiamate da admin, se ci si dimentica di aggiornarle
         * (cosa molto probabile)).
         * Nel secondo caso, immaginando di aggiungere un "superadmin", esso non avrebbe accesso a quelle chiamate (e mi
         * sembra comunque brutto scrivere ogni volta la lista intera dei ruoli ammessi).
         */
        this.roleValues = {
            'admin': 4,
            'teacher': 2,
            'student': 1
        };

        this.getRolesArray = function () {
            var ans = [];
            for (var key in this.roleValues)
                if (this.roleValues.hasOwnProperty(key) && (userRole & this.roleValues[key]))
                    ans.push(key);

            return ans;
        };

        this.checkRole = function (roleName) {
            if (!that.roleValues[roleName])
                throw "Invalid role name";

            return (that.roleValues[roleName] & userRole) > 0; // Uso il > 0 per ritornare un booleano invece che un number
        };

        this.atLeast = function (roleName) {
            if (!that.roleValues[roleName])
                throw "Invalid role name";

            return userRole >= that.roleValues[roleName];
        };

        this.getRoleValue = function () {
            return userRole;
        };

        this.isLogged = function () {
            return isLogged;
        };

        this.getAuthToken = function () {
            return authToken;
        };

        function assignRoleValue(roleName) {
            userRole = 0;

            //noinspection FallThroughInSwitchStatementJS
            switch (roleName) {
                case 'admin':
                    userRole += that.roleValues['admin'];
                case 'teacher':
                    userRole += that.roleValues['teacher'];
                case 'student':
                    userRole += that.roleValues['student'];
            }
        }

        this.login = function (username, password) {
            return ResourcesGeneratorService.getResource(null, 'login').save({
                username: username,
                password: password
            }).$promise
                .then(function (response) {
                    $window.localStorage.setItem('authToken', response.token);
                    authToken = response.token;
                    isLogged = true;
                    assignRoleValue(response.role);

                    return response;
                }, function (error) {
                    $window.localStorage.removeItem('authToken');
                    authToken = null;
                    isLogged = false;

                    return $q.reject(error.data);
                });
        };

        this.logout = function () {
            if (!authToken || !isLogged)
                return $q.reject('null authToken');

            return ResourcesGeneratorService.getResource(authToken, 'logout').get().$promise
                .then(function (response) {
                    $window.localStorage.removeItem('authToken');
                    authToken = null;
                    isLogged = false;
                    userRole = 0;

                    return response;
                }, function (error) {
                    return $q.reject(error.data);
                });
        };

        this.getSessionInfo = function () {
            if (!authToken)
                return $q.reject('null authToken');

            return ResourcesGeneratorService.getResource(authToken, 'info').get().$promise
                .then(function (response) {
                    isLogged = true;
                    assignRoleValue(response.role);

                    return response;
                }, function (error) {
                    isLogged = false;

                    return $q.reject(error.data);
                });
        };
    });