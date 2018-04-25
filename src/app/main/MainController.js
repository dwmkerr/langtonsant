
import LangtonsAnt from '../langtonsant.js';

class MainController {
  constructor($scope, $timeout) {
    const self = this;
    //  Scope variables - can be bound in the view.

    //  The frequency of universe ticks
    this.tickFrequency = 10;
    this.randomness = 0.0;

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
      tickIntervalId = setInterval(this.tick,
        1000 / this.tickFrequency);

      //  Set the status.
      currentState = 'running';
    };

    this.tick = () => {
      self.universe.stepForwards();

      //  Apply randomness if required.
      if (self.randomness !== 0) {
        if ((Math.random() * 100) < self.randomness) {
          //  Randomise the ants direction.
          const direction = Math.random() < 0.5 ? 90 : -90;
          self.universe.antDirection += direction;
        }
      }

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
        clearInterval(tickIntervalId);
      }

      //  Completely recreate the universe.
      self.universe = new LangtonsAnt();
      self.universe.initialise({states: self.states});
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
      clearInterval(tickIntervalId);

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

    //  Apply the speed change, resetting the timer if necessary.
    this.frequencyChanged = () => {
      //  Nothing to do if we're not running.
      if(currentState !== 'running') {
        return;
      }

      //  Reset the timer.
      clearInterval(tickIntervalId);
      tickIntervalId = setInterval(self.tick, 
        1000 / this.tickFrequency);
    };

    this.increaseSpeed = () => {
      this.tickFrequency = this.tickFrequency * 2; 
      this.frequencyChanged();
    };
    this.decreaseSpeed = () => {
      this.tickFrequency = this.tickFrequency / 2; 
      this.frequencyChanged();
    };
  }
};
 
MainController.$inject = ['$scope', '$timeout'];

export default MainController;
