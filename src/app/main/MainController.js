import LangtonsAnt from '../langtonsant.js';
import { render } from '../langton-renderer-canvas2d';

function frequencyInterval(frequency) {
  //  We can't set timers below 10ms, so any frequency beyond 100 Hz is going to
  //  be cropped down. 150Hz becomes 7.5Hz with 2 ticks per iteration.
  let f = frequency;
  let i = 1000 / f;
  let t = 1;
  while ( i < 10 ) {
    f = f / 2;
    i = 1000 / f;
    t = t * 2;
  }

  return { f, i, t };
}

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

    //  Available tile states, with the corresponding Turk/Propp configuration.
    this.states = [
      {direction:'L', colour: this.defaultStateColours[0]},
      {direction:'R', colour: this.defaultStateColours[1]}
    ];
    this.configuration = 'LR';

    //  None scope variables. These are used by the controller, but not exposed.
    var currentState = "stopped";
    var tickIntervalId = null;
    var canvas = null;

    //  Initialise the universe with the states.
    this.universe = new LangtonsAnt({ states: this.states });

    //  When the document is ready, we'll grab the antcanvas.
    $timeout(function() {
      canvas = document.getElementById('antcanvas');
      self.render();
    });

    //  Runs the simulation.
    this.run = function() {
      //  If we're already running, we can't start the simulation.
      if(currentState === 'running') {
        return;
      }

      //  Start the timer.
      const { i } = frequencyInterval(self.tickFrequency);
      tickIntervalId = setInterval(this.tick, i);

      //  Set the status.
      currentState = 'running';
    };

    this.stepBackwards = () => {
      self.universe.stepBackwards();
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

    this.stepForwards = () => {
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

    this.tick = () => {
      //  Work out how many ticks we're taking.
      let { t } = frequencyInterval(self.tickFrequency);
      while (t--) {
        this.stepForwards();
      }
    };

    this.getCurrentState = function() {
      return currentState;
    };

    this.render = function() {
      if(canvas !== null && canvas !== undefined) {
        //  Use the 2D rendering function.
        render(self.universe, canvas, {
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
      self.universe = new LangtonsAnt({ states: self.states });
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

    this.configurationChanged = () => {
      //  Rebuild the state index.
      this.states = [];
      for (let i = 0; i < this.configuration.length; i++) {
        var colourIndex = i % this.defaultStateColours.length;
        this.states.push({
          direction: this.configuration[i],
          colour: this.defaultStateColours[colourIndex]
        });
      };

      //  Reset.
      this.reset();
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
      const { i } = frequencyInterval(self.tickFrequency);
      tickIntervalId = setInterval(self.tick, i);
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
