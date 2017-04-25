import app from './app';


app.directive('mwError', ['$parse', '$timeout', function ($parse, $timeout) {

    function computeError(value, result) {

        if (value && value.mw) {

            if (!result.message) {

                var message = null;
                if (value.mw.errorMessages.length > 0) {
                    message = value.mw.errorMessages[0].message;
                } else if (value.mw.customErrorMessages.length > 0) {
                    message = value.mw.customErrorMessages[0].message;
                }

                result.message = message;
            }

            if (!value.mw.isFocus) {

                if ((value.mw.form && value.mw.form.hasSubmit) || value.mw.hasBlur) {
                    if (!value.$valid || value.mw.customErrorMessages.length > 0) {
                        result.nbError += 1;
                    }
                }

            } else {
                result.nbFocus += 1;
            }
        }

        return result;
    }

    // Permet de vérifier qu'une valeur a changer
    // Ici toute les valeur que l'on souhaite vérifier
    function getWatchedElement(value, result) {
        result += value.$valid + "";
        if (value.mw) {

            if (value.mw.errorMessages.length > 0) {
                result += value.mw.errorMessages[0].message;
            }

            if (value.mw.errorMessages.length > 0) {
                result += value.mw.errorMessages[0].message;
            }

            if (value.mw.customErrorMessages && value.mw.customErrorMessages.length > 0) {
                result += value.mw.customErrorMessages[0].message;
            }
            if (value.mw.form) {
                result += value.mw.form.hasSubmit;
            }
            result += value.mw.isFocus;
            result += value.mw.hasBlur;
        }
        return result;
    }

    var template = '<div><span class="glyphicon glyphicon-remove form-control-feedback"></span><span class="error-block"></span></div>';

    return {
        restrict: 'EA',
        template: template,
        replace: true,
        compile: function (element, attrs, transclude) {

            return function (scope, elm, attr, ctrl) {

                if (attr.mwError) {

                            var setErrorClass = function (result) {
                                if (result.nbFocus <= 0) {
                                    if (result.nbError > 0) {
                                        if (result.message) {
                                            angular.element(elm[0].getElementsByClassName("error-block")).html(result.message);
                                        }
                                        elm.css("display", "block");
                                    } else {
                                        elm.css("display", "none");
                                    }
                                }
                    };

                    // On retourne la valeur de l'élement watché
                    // Si elle a changé, angular déclanche la fonction
                    var watchFunction = function ($scope) {

                        var value = $scope.$eval(attr.mwError);
                        var result = '';
                        if (value) {
                            var l = value.length;
                            if (value instanceof Array) {
                                for (var i = 0; i < l; i++) {
                                    var elem = value[i];
                                    result += getWatchedElement(elem, result);
                                }
                            } else {
                                result = getWatchedElement(value, result);
                            }
                        }

                        // This becomes the value we're "watching".
                        return result;
                    };

                    var destroyWatch = scope.$watch(watchFunction, function (newValue) {
                        var result = {
                            nbFocus: 0,
                            nbError: 0
                        };
                        var value = scope.$eval(attr.mwError);
                        if (value) {
                            var l = value.length;
                            if (value instanceof Array) {
                                for (var i = 0; i < l; i++) {
                                    var val = value[i];
                                    result = computeError(val, result);
                                }
                            } else {
                                result = computeError(value, result);
                            }
                            setErrorClass(result);
                        }
                    }, false);

                    scope.$on('$destroy', function () {
                        destroyWatch();
                    });
                }

            };

        }
    };
}]);
