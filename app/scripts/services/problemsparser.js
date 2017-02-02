'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.service:ProblemsParserService
 * @description
 * # ProblemsParserService
 * Service of the frontendStableApp
 */
angular.module('frontendStableApp')
    .service('ProblemsParserService', function () {
        var regex = /n\. ([0-9]+).*user time:[ ]+([0-9.]+)s] (.*)/;

        this.parse = function (lines) {
            var ans = [];

            lines.forEach(function (line) {
                var groups = line.match(regex);

                if (groups != null) {
                    var caseId = parseInt(groups[1]);
                    var runtime = parseFloat(groups[2]);
                    var outputText = groups[3];

                    ans.push(
                        {
                            caseId: caseId,
                            runtime: runtime,
                            outputText: outputText,
                            isCorrect: outputText == 'Output is correct'
                        }
                    );
                } else ans.push(line); // Di sicurezza
            });

            return ans;
        }
    });
