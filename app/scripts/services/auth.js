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
        var userId = null;
        var isLogged = false;
        var userRole = 0;
        var loginResponse = {};

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

        this.getLoginResponse = function () {
            return loginResponse;
        };

        this.getRolesArray = function () {
            var ans = [];
            for (var key in this.roleValues)
                if (this.roleValues.hasOwnProperty(key) && (userRole & this.roleValues[key]))
                    ans.push(key);

            return ans;
        };

        this.allowedForbidden = function (allowed, forbidden) {
            if (typeof allowed !== 'object')
                allowed = [allowed];
            if (typeof forbidden !== 'object')
                forbidden = [forbidden];

            var allowedSum = 0;
            for (var i = 0; i < allowed.length; i++)
                if (that.roleValues.hasOwnProperty(allowed[i]))
                    allowedSum += that.roleValues[allowed[i]];

            var forbiddenSum = 0;
            for (i = 0; i < forbidden.length; i++)
                if (that.roleValues.hasOwnProperty(forbidden[i]))
                    forbiddenSum += that.roleValues[forbidden[i]];

            return (userRole & forbiddenSum) == 0 && (userRole & allowedSum) > 0;
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

        this.hasAuthToken = function () {
            return authToken != undefined && authToken != null;
        };

        this.getUserId = function () {
            return userId;
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
                    userId = response.id;
                    isLogged = true;
                    loginResponse = response;
                    assignRoleValue(response.role);

                    return response;
                }, function (error) {
                    $window.localStorage.removeItem('authToken');
                    authToken = null;
                    isLogged = false;

                    return $q.reject(error.data);
                });
        };

        this.guestLogin = function () {
            loginResponse = {
                username: 'ospite'
            };
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
                    loginResponse = null;

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
                    loginResponse = response;
                    userId = response.id;
                    assignRoleValue(response.role);

                    return response;
                }, function (error) {
                    isLogged = false;

                    return $q.reject(error.data);
                });
        };
    });
