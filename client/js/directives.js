angular.module('langtonsant.directives', [])
    .directive('laColourpicker', function() {
        return {
            restrict: 'EA',                              //  Match elements,
            scope: {
                'colour': '='
            },
            templateUrl: "js/laColourPickertemplate.html"  //  Use the appropriate html file for the template.
        };
    })
    .directive('laLeftright', function() {
        return {
            restrict: 'E',
            scope: {
                'value': '='
            },
            templateUrl: "js/laLeftright.html"
        };
    });
