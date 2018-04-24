import angular from 'angular';

import 'jquery/dist/jquery.js'
import 'bootstrap3/dist/js/bootstrap.js';
import 'bootstrap3/dist/css/bootstrap.min.css';

import MainController from './main/MainController.js'
import main from './main/main.js'
;

//  Define the langtons ant module. It depends on app controllers and directives.
var app = angular.module('langtonsant', [])
  .directive('main', main)
  .controller('MainController', MainController)
  .directive('laColourpicker', function() {
    return {
      restrict: 'E',                              //  Match elements,
      scope: {
        'colour': '='
      },
      template: require('./laColourPickerTemplate.html'),
    };
  })
  .directive('laLeftright', function() {
    return {
      restrict: 'E',
      scope: {
        'value': '='
      },
      template: require('./laLeftRight.html')
    };
  });

//	Setup the canvas.
var canvas = document.getElementById("antcanvas");
function sizeCanvasToWindow() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', function resize(event) {
  sizeCanvasToWindow();
  // try and get the service injector. if we can, we can re-render.
  var scope = angular.element(document.getElementById('antcanvas')).scope();
  if (scope !== null && scope !== undefined) {
    scope.main.render();
  }
});
sizeCanvasToWindow();

export default 'langtonsant';
