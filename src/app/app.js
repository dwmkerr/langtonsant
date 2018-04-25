import angular from 'angular';

// window.$ = window.jQuery = require('jquery')

import 'bootstrap3/dist/js/bootstrap.js';
import 'bootstrap3/dist/css/bootstrap.min.css';

import MainController from './main/MainController.js'
import main from './main/main.js'
;

import { hitTest } from './langton-renderer-canvas2d';

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

//  Add a click handler, which we'll use to toggle tiles.
canvas.addEventListener('click', function(evt) {
  const getPos = (canvas, evt) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  };

  var mousePos = getPos(canvas, evt);

  var scope = angular.element(canvas).scope();
  if (scope !== null && scope !== undefined) {
    const universe = scope.main.universe;
    //  Use the 2D rendering function.
    const tile = hitTest(universe, canvas, scope.main, mousePos);
    universe.advanceTile(tile.x, tile.y);
    scope.main.render();
  }
}, false);


export default 'langtonsant';
