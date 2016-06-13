(function () {
    'use strict';


    angular.module('mw.validation').directive('mwValidate', [
        '$parse', '$timeout', '$q', '$window', function($parse, $timeout, $q, $window) {
            return {
                restrict: 'EA',
                require: ['ngModel','^?form'],
                priority: 100,
                compile: function (element, attrs, transclude) {

                    return {
                        pre: function (scope, elm, attr, ctrls) {

                            var ctrl = ctrls[0];

                            var formCtrl = ctrls[1]; //elm.controller('form');

                           // var parent = elm.parent().controller('form');

                            if (elm.length > 0 && elm[0].name && formCtrl && formCtrl[elm[0].name] && formCtrl[elm[0].name].mw) {
                                // Pour le cas particulié des radio boutons ou il y  a plusieur input avec le même "name"
                                // On relie alors les informations de validation entre elles (1 seul objet d'information)
                                // AngularJS lui crée quand à lui même 2 objet correspondant à chaque input
                                ctrl.mw = formCtrl[elm[0].name].mw;
                            } else {
                                ctrl.mw = ctrl.mw || {};
                            }

                            // Ces attribut ne sont utilisés que a des fins d'affichage
                            // Les attribut de validation de surfaces sont ceux d'angularJs

                            // Si le champ a le focus
                            ctrl.mw.isFocus = false;
                            // Si le champ a eu le focus
                            ctrl.mw.hasFocus = false;
                            // Si le champ déjà eu le focus puis a été quitté
                            ctrl.mw.hasBlur = false;
                            // Tableaux de messages d'erreur géré par la librairie
                            ctrl.mw.errorMessages = [];
                            // Tableaux des d'erreurs gérées manuellement
                            ctrl.mw.customErrorMessages = [];
                            // Information sur le formulaire parent
                            ctrl.mw.form = null;
                            // Si le champ déjà eu le focus puis a été quitté
                            ctrl.mw.isLoading = false;

                            // Permet de gèrer l'affichage d'un loader associé à un champ
                            ctrl.mw.setLoading = function(isLoading) {
                                if (ctrl.mw.isLoading != isLoading) {
                                    scope.$safeApply(function() {
                                            ctrl.mw.isLoading = isLoading;
                                        }
                                    );
                                }
                            };

                            // Permet de saisir une erreur manuellement
                            ctrl.mw.setValidity = function(key, isValid, message) {

                                if (!key) {
                                    if (isValid) {
                                        ctrl.mw.customErrorMessages.length = 0;
                                    } else {
                                        throw "La clé est obligatoire pour l'insertion d'une entrée nom valid";
                                    }
                                } else {

                                    if (isValid) {
                                        remove(ctrl.mw.customErrorMessages, key);
                                    } else {
                                        insert(ctrl.mw.customErrorMessages, key, message);
                                    }

                                }
                            };

                            function remove(array, key) {
                                var index = getIndeOf(array, key);
                                if (index !== null) {
                                    array.splice(index, 1);
                                }
                                return array;
                            }

                            function getIndeOf(array, key) {

                                if (array) {

                                    var l = array.length;

                                    for (var i = 0; i < l; i++) {
                                        var arrayElement = array[i];
                                        if (arrayElement.key == key) {
                                            return i;
                                        }
                                    }

                                }

                                return null;
                            }

                            function insert(array, key, message) {
                                if (array) {

                                    var index = getIndeOf(array, key);

                                    if (index !== null) {
                                        if (message) {
                                            array[index].message = message;
                                        }
                                    } else {
                                        if (!message) {
                                            message = "Une erreur de validation est survenue.";
                                        }
                                        array.push({ key: key, message: message });
                                    }

                                }
                            }

                            // On surcharge la méthode d'angular JS
                            var angularSetValidity = ctrl.$setValidity;
                            var self = ctrl;
                            ctrl.$setValidity = function(key, isValid, message) {
                                if (isValid !== null) {
                                    if (isValid === false) {
                                        insert(ctrl.mw.errorMessages, key, message);
                                    } else {
                                        remove(ctrl.mw.errorMessages, key);
                                    }
                                }

                                if (!(isValid === null && getIndeOf(ctrl.mw.errorMessages, key) !== null)) {
                                    angularSetValidity.call(self, key, isValid);
                                }
                            };

                            // On surcharge la méthode d'angular JS
                            var angularSetPristine = ctrl.$setPristine;
                            ctrl.$setPristine = function() {

                                scope.$safeApply(function() {
                                    ctrl.mw.isFocus = false;
                                    ctrl.mw.hasFocus = false;
                                    ctrl.mw.hasBlur = false;
                                });

                                angularSetPristine.call(self);
                            };
                            var angularSetDirty = ctrl.$setDirty;
                            ctrl.$setDirty = function() {

                                scope.$safeApply(function() {
                                    ctrl.mw.hasFocus = true;
                                    ctrl.mw.hasBlur = true;
                                });

                                angularSetDirty.call(self);
                            };

                            // On ne continue pas si les info sont vide
                            if (!attr.mwValidate) {
                                return;
                            }

                            // Validation lors du formatage Object => viewValue
                            ctrl.$formatters.unshift(function(modelValue) {
                                ctrl.mw.errorMessages.length = 0;

                                modelValue = ctrl.$$rawModelValue
                                var result = validateInternal(modelValue, "validateModel");

                                //if (result.isValid) {
                                    var length = result.formatters.length;

                                    for (var i = 0; i < length; i++) {
                                        return result.formatters[i](modelValue);
                                    }
                                //}

                                if(modelValue != null && modelValue != undefined){
                                    return modelValue.toString();
                                }
                                return modelValue;
                            });

                            // Validation lors du parsing viewValue => Object
                            ctrl.$parsers.unshift(function(viewValue) {
                                ctrl.mw.errorMessages.length = 0;

                                var result = validateInternal(viewValue, "validateView");

                                //if (result.isValid) {
                                    var length = result.parsers.length;
                                    for (var i = 0; i < length; i++) {
                                        return result.parsers[i](viewValue);
                                    }
                                    return viewValue;
                                //} 
                                 
                                //return "";
                            });

                            // Réalise l'éxécution de la validation
                            function validateInternal(viewValue, validateMethodName) {

                                var rulesDefinition = scope.$eval(attr.mwValidate);
                                var formatters = [];
                                var parsers = [];

                                var validationResults = $window.mw.validation[validateMethodName](viewValue, rulesDefinition);

                                var isValid = true;

                                for (var i = 0; i < validationResults.length; i++) {

                                    var validationResult = validationResults[i];
                                    var isSuccess = validationResult.success;

                                    // Sauvegarde le formatter viewvalue -> object
                                    if (validationResult.formatter) {
                                        formatters.push(validationResult.formatter);
                                    }
                                    // Sauvegarde le parser object -> viewValue
                                    if (validationResult.parser) {
                                        parsers.push(validationResult.parser);
                                    }

                                    ctrl.$setValidity(validationResult.name, isSuccess, validationResult.message);

                                    if (!isSuccess) {
                                        isValid = false;
                                    }
                                }

                                // Une erreur synchrone bloque le rafrâcihissement de l'objet
                                // Pas une erreur asynchrone
                                return {
                                    isValid: isValid,
                                    formatters: formatters,
                                    parsers: parsers
                                };
                            }

                            // Observe les changements dans la validation
                            // TODO: attention, si il y a une erreure le formatage View value=>Object value n'est pas applique
                            var watchDestroyes = null;

                            function internalValidate() {

                                validateInternal(ctrl.$viewValue, "validateView");

                                if (watchDestroyes) {
                                    var l = watchDestroyes.length;

                                    // Débranches tous les watch
                                    for (var i = 0; i < l; i++) {
                                        var destroy = watchDestroyes[i];
                                        destroy();
                                    }
                                }

                                // Branche les watch
                                watchDestroyes = watchFunctions();

                            }

                            scope.$watch(attrs.mwValidate, internalValidate, true);

                            // Permet de scrutter tous les paramètres dépendants à d'autre variable
                            // les paramétres function();
                            function watchFunctions() {

                                var destroyes = [];

                                // On attache un watch afin de détecter une modification dans
                                // les dépendances à la validation (les fonctions)
                                var rulesDefinition = scope.$eval(attr.mwValidate);

                                // Extrait toutes les fonctions récurssivements
                                var functions = $window.mw.objectValidation.getFunctions(rulesDefinition);
                                var l = functions.length;
                                // On gette tous changements dans les retours des fonctions

                                function tempValidate() {
                                   // validateInternal(ctrl.$viewValue, "validateView");
                                    ctrl.$$parseAndValidate();
                                }

                                for (var i = 0; i < l; i++) {
                                    
                                    var func = functions[i];
                                    var funcToBind = func.func;
                                    if(func.name ==="validateView"){
                                        funcToBind = function(){
                                            return func.func(ctrl.$viewValue);
                                        }
                                    } /*else if(func.name ==="validateModel")  {
                                        funcToBind = function(){
                                            return func.func(ctrl.$modelValue);
                                        }
                                    }*/
                                    
                                    var destroy = scope.$watch(funcToBind, tempValidate, true);

                                    destroyes.push(destroy);
                                }

                                return destroyes;
                            }

                        },
                        post: function(scope, elm, attr, ctrls) {

                            // Fonctions privées ////////////////
                            scope.$safeApply = function(fn) {
                                var phase = this.$root.$$phase;
                                if (phase == '$apply' || phase == '$digest') {
                                    if (fn && (typeof (fn) === 'function')) {
                                        fn();
                                    }
                                } else {
                                    this.$apply(fn);
                                }
                            };

                            var ctrl = ctrls[0];

                            var formCtrl = ctrls[1];

                            if (!ctrl) return;
                            // link function body there

                           // var formCtrl = elm.controller('form');

                            // Réalise un lien avec les données du parents
                            if (formCtrl && formCtrl.mw) {
                                ctrl.mw.form = formCtrl.mw;
                            }

                            // Event sur l'entréer dans le champs
                            elm.on('focus', function() {
                                if (ctrl.mw.isFocus === false) {
                                    scope.$safeApply(function() {
                                        ctrl.mw.hasFocus = true;
                                        ctrl.mw.isFocus = true;
                                    });
                                }
                            });

                            // event sur la sortie du champs
                            elm.on('blur', function() {
                                if (ctrl.mw.isFocus === true) {
                                    scope.$safeApply(function() {
                                        ctrl.mw.hasBlur = true;
                                        ctrl.mw.isFocus = false;
                                    });
                                }
                            });

                        }
                    };
                }
            };

        }
    ]);



    }());
