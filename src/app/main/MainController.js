
import LangtonsAnt from '../langtonsant.js';

class MainController {
  constructor($scope, $interval, $timeout) {
    const self = this;
    //  Scope variables - can be bound in the view.

    //  The frequency of universe ticks
    this.tickFrequency = 10;

    //  Rendering / layout variables.
    this.zoomFactor = 1.0;
    this.offsetX = 0;
    this.offsetY = 0;

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
    var canvas = null;
    this.universe = new LangtonsAnt();

    //  When the document is ready, we'll grab the antcanvas.
    $timeout(function() {
      canvas = document.getElementById('antcanvas');
      self.render();
    });

    //  Initialise the universe with the states.
    this.universe.initialise({states: this.states});

    //  Runs the simulation.
    this.run = function() {
      //  If we're already running, we can't start the simulation.
      if(currentState === 'running') {
        return;
      }

      //  Start the timer.
      tickIntervalId = $interval(function() {
        self.universe.stepForwards();
        self.info.currentTicks = self.universe.ticks;
        self.render();
      }, 1000 / this.tickFrequency);

      //  Set the status.
      currentState = 'running';
    };

    this.tick = function() {
      self.universe.stepForwards();
      self.info.currentTicks = self.universe.ticks;
      self.render();
    };

    this.getCurrentState = function() {
      return currentState;
    };

    this.render = function() {
      if(canvas !== null && canvas !== undefined) {
        self.universe.render(canvas, {
          zoomFactor: self.zoomFactor,
          offsetX: self.offsetX,
          offsetY: self.offsetY
        });
      }
    };

    this.reset = function() {

      //  If we're running, stop the timer.
      if(currentState === 'running') {
        $interval.cancel(tickIntervalId);
      }

      //  Completely recreate the universe.
      self.universe = new LangtonsAnt();
      self.universe.initialise({states: self.states});
      self.info.currentTicks = 0;
      self.offsetX = this.offsetY = 0;
      self.zoomFactor = 1.0;

      //  Set the status.
      currentState = 'paused';
      self.render();
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
      this.offsetX -= tiles || 1;
      this.render();
    };
    this.moveRight = function(tiles) {
      this.offsetX += tiles || 1;
      this.render();
    };
    this.moveUp = function(tiles) {
      this.offsetY -= tiles || 1;
      this.render();
    };
    this.moveDown = function(tiles) {
      this.offsetY += tiles || 1;
      this.render();
    };
    this.moveOrigin = function() {
      this.offsetX = this.offsetY = 0;
      this.render();
    };
    this.zoomIn = function() {
      this.zoomFactor *= 1.1;
      this.render();
    };
    this.zoomOut = function() {
      this.zoomFactor *= 0.9;
      this.render();
    };
  }
};
 
MainController.$inject = ['$scope', '$interval', '$timeout'];

export default MainController;
