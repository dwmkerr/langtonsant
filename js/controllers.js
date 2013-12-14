//  All controllers go in the langtonsant.controllers module.
angular.module('langtonsant.controllers', [])
    .controller('MainController', function($scope, $interval, $timeout, $document) {
        var self = this;

        //  Scope variables - can be bound in the view.

        //  Do we show advanced settings?
        this.showSettings = false;

        //  The frequency of simulation ticks
        this.tickFrequency = 10;

        //  Available tile states.
        this.states = [
            {direction:'L', colour: '#FFFFFF'},
            {direction:'R', colour: '#000000'}
        ];

        //  Current (new) state that's being edited.
        this.newState = {
            direction: 'L',
            colour: '#336600'
        };

        //  Simulatio info.
        this.info = {
            currentTicks: 0,
            currentMinX: 0,
            currentMaxX: 0,
            currentMinY: 0,
            currentMaxY: 0,
            antX: 0,
            antY: 0
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
                self.info.currentMinX = simulation.bounds.xMin;
                self.info.currentMaxX = simulation.bounds.xMax;
                self.info.currentMinY = simulation.bounds.yMin;
                self.info.currentMaxY = simulation.bounds.yMax;
                self.info.antX = simulation.antPosition.x;
                self.info.antY = simulation.antPosition.y;
                self.render();
            }, 1000 / this.tickFrequency);

            //  Set the status.
            currentState = 'running';
        };

        this.getCurrentState = function() {
            return currentState;
        };

        this.toggleShowSettings = function() {
            this.showSettings = this.showSettings === true ? false : true;
        }

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
            this.info.currentMinX = 0;
            this.info.currentMaxX = 0;
            this.info.currentMinY = 0;
            this.info.currentMaxY = 0;
            this.info.antX = 0;
            this.info.antY = 0;

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
            this.states.push(this.newState);
            this.newState = {direction:'L', colour:"#FFFFFF"};
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
    });