'use strict';

/**
 * @ngdoc function
 * @name frontendStableApp.provider:Tips
 * @description
 * # Tips
 * Provider of the frontendStableApp
 */
angular.module('frontendStableApp')
    .provider('Tips', function () {
        var tips = [
            '1 byte è composto da addirittura 8 bit! Sono tanti 8 bit...',
            'Se cancelli system32 il computer va più veloce!',
            'Puoi usare il 100% del tuo computer senza mouse, prova!',
            'sudo rm -rf /* cambia sfondo del desktop su Ubuntu',
            'Han Solo MUORE',
            'Se hai Chrome puoi ancora vedere i voti sul registro (◕ᴗ◕✿)',
            'I gorilla sono animali notoriamente bravi a battere sulla tastiera',
            'Telegram è meglio di Whatsapp',
            'In C99 puoi dichiarare array anonimi con (int[]){...}',
            'Puoi inizializzare le strutture a 0 con struct something X = {0};',
            'In GCC il compilatore accetta suggerimenti sul branching del codice, rendendo potenzialmente più efficiente il codice'
        ];

        var tipsIndex = 0;

        // Fisher–Yates shuffle
        function shuffle(array) {
            var counter = array.length;

            // While there are elements in the array
            while (counter > 0) {
                // Pick a random index
                var index = Math.floor(Math.random() * counter);

                // Decrease counter by 1
                counter--;

                // And swap the last element with it
                var temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }

            return array;
        }

        this.$get = function () {
            return {
                nextTip: function () {
                    if (tipsIndex == 0 || tipsIndex == tips.length) {
                        tipsIndex = 0;
                        shuffle(tips);
                    }

                    return tips[tipsIndex++];
                }
            }
        }
    });
