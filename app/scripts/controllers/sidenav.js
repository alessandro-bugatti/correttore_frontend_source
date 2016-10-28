'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.controller:SidenavCtrl
 * @description
 * # SidenavCtrl
 * Controller of the frontendStableApp
 */
angular.module('frontendStableApp')
    .controller('SidenavCtrl', function ($scope, $mdMedia, $mdDialog, $mdSidenav, $location, Config, $rootScope, AuthService) {
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        $scope.authService = AuthService;

        $scope.closed = false;
        $rootScope.$on('sidenav-close', function () {
            $scope.closed = true;
        });

        $rootScope.$on('sidenav-toggle', function () {
            $scope.closed = !$scope.closed;
        });

        $rootScope.$on('sidenav-open', function () {
            $scope.closed = false;
        });

        $scope.menuEntries = [
            {
                title: 'Docenti',
                description: 'Gestisci i docenti',
                icon: 'graduation-cap',
                allowed: 'admin',
                link: '/teachers'
            },
            {
                title: 'Gruppi',
                description: 'Gestisci i gruppi',
                icon: 'users',
                allowed: ['admin', 'teacher'],
                link: '/groups'
            },
            {
                title: 'Verifiche',
                description: 'Visualizza le verifiche',
                icon: 'graduation-cap',
                allowed: ['teacher'],
                link: '/tests'
            },
            {
                title: 'Verifiche',
                description: 'Visualizza le verifiche',
                icon: 'graduation-cap',
                allowed: ['student'],
                link: '/studentstests'
            },
            {
                title: 'Problemi',
                description: 'Gestisci i problemi',
                icon: 'tasks', // FIXME: Fa abbastanza schifo
                allowed: ['admin', 'teacher'],
                link: '/tasks'
            },
            {
                title: 'Esercizi',
                description: 'Sottometti una soluzione',
                icon: 'code',
                allowed: '*',
                link: '/problems'
            },
            {
                title: 'Disconnetti',
                description: 'Esegui il logout',
                icon: 'sign-out',
                allowed: '*',
                callback: function (entry, event) {
                    if (AuthService.isLogged())
                        AuthService.logout()
                            .then(function () {
                                $location.path('/login');
                            });
                    else
                        $location.path('/login');
                }
            },
            {
                title: 'Informazioni',
                description: 'Informazioni sul correttore',
                icon: 'info-circle',
                allowed: '*',
                callback: function (entry, event) {
                    openAboutDialog(event)
                }
            }
        ];

        $scope.handleClick = function (entry, event) {
            if (entry.link)
                $scope.goTo(entry.link);
            else if (typeof entry.callback === 'function')
                entry.callback(entry, event);

            $mdSidenav('left').close();
        };

        $scope.display = function (entry) {
            if (!entry.allowed)
                entry.allowed = [];
            else if (typeof entry.allowed !== 'object') {
                if (entry.allowed == '*')
                    return true;

                entry.allowed = [entry.allowed];
            }

            if (!entry.forbidden)
                entry.forbidden = [];
            else if (typeof entry.forbidden !== 'object') {
                if (entry.forbidden == '*')
                    return false;

                entry.forbidden = [entry.forbidden];
            }

            return AuthService.allowedForbidden(entry.allowed, entry.forbidden);
        };

        function openAboutDialog(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: 'DialogCtrl',
                templateUrl: 'views/about.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    items: {
                        clientVersion: Config.getVersion(),
                        rootScope: $rootScope
                    }
                }
            });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        $scope.goTo = function (path) {
            $location.path(path);
        };
    });
