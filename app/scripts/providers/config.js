'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.provider:Config
 * @description
 * # Config
 * Provider of the frontendStableApp
 */
angular.module('frontendStableApp')
    .provider('Config', function () {
        /*
         * Non inserisco valori di default per obbligare l'utilizzatore di questo provider (e dei services che dipendono
         * da esso a configurare in modo esplicito questi parametri, come in app.js)
         */

        this.serverVersion = null;
        this.serverHost = null;
        this.authTokenName = null;

        var exceptionStringValue = "Uninitialized config server values";

        this.$get = function () {
            var obj = this;
            return {
                getServerPath: function () {
                    if (!obj.serverHost || !obj.serverVersion)
                        throw exceptionStringValue;

                    return obj.serverHost + '/' + obj.serverVersion + '/';
                },

                getAuthTokenName: function () {
                    if (!obj.authTokenName)
                        throw exceptionStringValue;

                    return obj.authTokenName;
                }
            }
        }
    });
