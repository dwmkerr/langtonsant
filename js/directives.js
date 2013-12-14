angular.module('langtonsant.directives', [])
    .directive('laColourpicker', function() {
        return {
            restrict: 'EA',                              //  Match elements,
            scope: {
                'colour': '='
            },
            templateUrl: "js/laColourPickerTemplate.html"  //  Use the appropriate html file for the template.
        };
    });
