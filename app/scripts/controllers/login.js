'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the frontendStableApp
 */
angular.module('frontendStableApp')
    .controller('LoginCtrl', function (AuthService, $scope, $location, $rootScope, $mdSidenav, $mdTheming) {
        if (AuthService.isLogged()) {
            loginCompletato();
            return;
        }

        $mdSidenav('left').close();
        $rootScope.$emit('sidenav-close');
        $rootScope.$emit('toolbar-hide');

        $scope.user = {
            username: '',
            password: ''
        };

        function loginCompletato() {
            $rootScope.$emit('sidenav-open');
            $rootScope.$emit('toolbar-show');

            if ($mdTheming.THEMES.hasOwnProperty(AuthService.getLoginResponse().role)) // Controllo che il tema sia valido
                $rootScope.theme = AuthService.getLoginResponse().role;

            if ($location.search().redirect) {
                $location.path($location.search().redirect);
                $location.search({});
            } else
                $location.path('/');
        }

        $scope.loading = false;
        $scope.loginForm = true;
        $scope.loadingMessage = 'Accesso in corso...';
        $scope.errorMessage = null;

        if (!$scope.loading)
            $rootScope.theme = 'guest'; // assumo che 'guest' ci sia sempre

        if (AuthService.hasAuthToken()) {
            $scope.loadingMessage = 'Ripresa della sessione...';
            $scope.loginForm = false;
            $scope.loading = true;

            AuthService.getSessionInfo()
                .then(function () {
                    loginCompletato();
                }, function () {
                    $scope.errorMessage = 'La sessione è scaduta. Accedi per continuare';
                    $scope.loadingMessage = 'Accesso in corso...';
                    $scope.loading = false;
                    $scope.loginForm = true;
                });
        }

        $scope.login = function () {
            $scope.errorMessage = null;
            $scope.loading = true;

            AuthService.login($scope.user.username, $scope.user.password)
                .then(function () {
                    loginCompletato();
                }, function () {
                    $scope.loading = false;
                    $scope.errorMessage = 'Credenziali non valide';
                })
        };

        $scope.guestLogin = function () {
            $rootScope.$emit('sidenav-open');
            $rootScope.$emit('toolbar-show');

            AuthService.guestLogin();
            $location.path('/problems');
            $location.search({});
        };
    });
