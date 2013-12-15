//  Define the langtons ant module. It depends on app controllers,
//  services, filters and directives.
var app = angular.module('langtonsant',
    ['langtonsant.controllers',
     'langtonsant.directives',
     'langtonsant.services']);