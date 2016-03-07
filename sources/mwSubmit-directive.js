(function() {
'use strict';


    angular.module('mw.validation').directive('mwSubmit', [
        '$parse', '$timeout', '$q', function($parse, $timeout, $q) {
            return {
                restrict: 'EA',
                require: 'form',
                compile: function (element, attrs, transclude) {

                    return {
                        pre: function(scope, elm, attr, ctrl) {

                            ctrl.mw = ctrl.mw || {};

                            ctrl.mw.hasSubmit = false;
                            ctrl.mw.isAlone = false;

                            if (attr.mwAlone !== undefined) {
                                ctrl.mw.isAlone = true;
                            }

                            // TODO Enlever se truc et faire propre et optimizé
                            scope.$safeApply = function(fn) {
                                var phase = this.$root.$$phase;
                                if (phase === '$apply' || phase === '$digest') {
                                    if (fn && (typeof fn === 'function')) {
                                        fn();
                                    }
                                } else {
                                    this.$apply(fn);
                                }
                            };

                            // On surcharge la méthode d'angular JS
                            var angularSetPristine = ctrl.$setPristine;
                            var self = ctrl;
                            ctrl.$setPristine = function() {

                                scope.$safeApply(function() {
                                    ctrl.mw.hasSubmit = false;
                                });

                                angularSetPristine.call(self);
                            };

                            ctrl.mw.setHasSubmit = function (hasSubmit) {
                                scope.$safeApply(function () {
                                    ctrl.mw.hasSubmit = hasSubmit;
                                });
                            };

                            //  On surcharge la méthode d'angular JS
                            var angularSetValidity = ctrl.$setValidity;
                            ctrl.$setValidity = function(validationToken, isValid, control) {
                                // Si le controle est indépendant alors on ne propage pas les invalidités
                                if (control.mw) {

                                    // Si control est un input
                                    if (control.mw.form) {
                                        // On propage l'event au formulaire
                                        angularSetValidity.call(self, validationToken, isValid, control);
                                    } else {
                                        // controle est un formulaire on propage l'event au parent que s'il est pas alone
                                        if (!control.mw.isAlone) {
                                            angularSetValidity.call(self, validationToken, isValid, control);
                                        }
                                    }
                                } else {
                                    // Fonctionnement classique
                                    angularSetValidity.call(self, validationToken, isValid, control);
                                }
                            };

                        },
                        post: function(scope, elm, attr, ctrl) {

                            // Permet a un sous formulaire d'appliquer le submit, si le submit provient ses enfants
                            elm.bind('submit', function(event) {
                                scope.$safeApply(function() {
                                    ctrl.mw.hasSubmit = true;
                                    scope.$eval(attr.mwSubmit);
                                });

                            });

                            // Permet de soumettre un sous-formulaire
                            // lorsque le client press la touche entrer
                            if (elm[0].nodeName != 'FORM') {
                                elm.keypress(function(event) {

                                    // sauf dans le cas d'un text area        
                                    if (event.target.nodeName == "TEXTAREA") {
                                        return;
                                    }

                                    var keycode = (event.keyCode ? event.keyCode : event.which);
                                    if (keycode == '13') {

                                        if (attr.mwSubmit) {
                                            scope.$safeApply(function() {
                                                ctrl.mw.hasSubmit = true;
                                                scope.$eval(attr.mwSubmit);
                                            });
                                        }

                                        event.preventDefault();
                                        event.stopPropagation();
                                    }
                                });
                            }

                        }
                    };

                }
            };
        }
    ]);



}());
