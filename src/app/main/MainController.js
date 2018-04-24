
import LangtonsAnt from '../langtonsant.js';

class MainController {
  constructor($scope, $interval, $timeout) {
    const self = this;
    //  Scope variables - can be bound in the view.

    //  The frequency of simulation ticks
    this.tickFrequency = 10;

    //  The set of default colours for states.
    this.defaultStateColours = [
      '#FFFFFF',
      '#49708A',
      '#88ABC2',
      '#D0E0EB',
      '#EBF7F8'
    ];

    //  Available tile states.
    this.states = [
      {direction:'L', colour: this.defaultStateColours[0]},
      {direction:'R', colour: this.defaultStateColours[1]}
    ];

    //  Simulatio info.
    this.info = {
      currentTicks: 0
    };

    //  None scope variables. These are used by the controller, but not exposed.
    var currentState = "stopped";
    var tickIntervalId = null;
    var simulation = new LangtonsAnt();
    var canvas = null;

    //  When the document is ready, we'll grab the antcanvas.
    $timeout(function() {
      canvas = document.getElementById('antcanvas');
      self.render();
    });

    //  Initialise the simulation with the states.
    simulation.initialise({states: this.states});

    //  Runs the simulation.
    this.run = function() {
      //  If we're already running, we can't start the simulation.
      if(currentState === 'running') {
        return;
      }

      //  Start the timer.
      tickIntervalId = $interval(function() {
        simulation.stepForwards();
        self.info.currentTicks = simulation.ticks;
        self.render();
      }, 1000 / this.tickFrequency);

      //  Set the status.
      currentState = 'running';
    };

    this.getCurrentState = function() {
      return currentState;
    };

    this.render = function() {
      if(canvas !== null && canvas !== undefined) {
        simulation.render(canvas);
      }
    };

    this.reset = function() {

      //  If we're running, stop the timer.
      if(currentState === 'running') {
        $interval.cancel(tickIntervalId);
      }

      //  Completely recreate the simulation.
      simulation = new LangtonsAnt();
      simulation.initialise({states: this.states});
      this.info.currentTicks = 0;

      //  Set the status.
      currentState = 'paused';
      this.render();
    };

    this.pause = function() {

      //  If we're already paused, there's nothing to do.
      if(currentState === 'paused') {
        return;
      }

      //  Cancel the timer.
      $interval.cancel(tickIntervalId);

      //  Set the status.
      currentState = 'paused';
    };

    this.removeState = function(state) {
      var index = this.states.indexOf(state);
      if(index !== -1) {
        this.states.splice(index, 1);
      }
    };

    this.addState = function() {
      //  Create a new state with the next colour in the list.
      var colourIndex = this.states.length % this.defaultStateColours.length;
      this.states.push({
        direction: 'L',
        colour: this.defaultStateColours[colourIndex]
      });
    };

    this.moveLeft = function(tiles) {
      simulation.offsetX -= tiles || 1;
      this.render();
    };
    this.moveRight = function(tiles) {
      simulation.offsetX += tiles || 1;
      this.render();
    };
    this.moveUp = function(tiles) {
      simulation.offsetY -= tiles || 1;
      this.render();
    };
    this.moveDown = function(tiles) {
      simulation.offsetY += tiles || 1;
      this.render();
    };
    this.moveOrigin = function() {
      simulation.offsetX = simulation.offsetY = 0;
      this.render();
    };
    this.zoomIn = function() {
      simulation.zoomFactor *= 1.1;
      this.render();
    };
    this.zoomOut = function() {
      simulation.zoomFactor *= 0.9;
      this.render();
    };
  }
};
 
MainController.$inject = ['$scope', '$interval', '$timeout'];

export default MainController;
