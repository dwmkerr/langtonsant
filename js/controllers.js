//  All controllers go in the langtonsant.controllers module.
angular.module('langtonsant.controllers', [])
    .controller('MainController', function($scope, $interval, simulationService) {

        //  Scope variables - can be bound in the view.

        //  Do we show advanced settings?
        $scope.showSettings = false;

        //  The frequency of simulation ticks
        $scope.tickFrequency = 10;

        //  Available tile states.
        $scope.states = [
            {direction:'L', colour: '#FFFFFF'},
            {direction:'R', colour: '#000000'}
        ];

        //  Current (new) state that's being edited.
        $scope.newState = {
            direction: 'L',
            colour: '#336600'
        };

        //  Simulatio info.
        $scope.info = {
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
        var simulation = simulationService.simulation;

        //  Initialise the simulation with the states.
        simulation.initialise({states: $scope.states});

        //  Runs the simulation.
        $scope.run = function() {
            //  If we're already running, we can't start the simulation.
            if(currentState === 'running') {
                return;
            }

            //  Start the timer.
            tickIntervalId = $interval(function() {
                simulation.stepForwards();
                $scope.info.currentTicks = simulation.ticks;
                $scope.info.currentMinX = simulation.bounds.xMin;
                $scope.info.currentMaxX = simulation.bounds.xMax;
                $scope.info.currentMinY = simulation.bounds.yMin;
                $scope.info.currentMaxY = simulation.bounds.yMax;
                $scope.info.antX = simulation.antPosition.x;
                $scope.info.antY = simulation.antPosition.y;
                $scope.render();
            }, 1000 / $scope.tickFrequency);

            //  Set the status.
            currentState = 'running';
        };

        $scope.reset = function() {

            //  If we're running, stop the timer.
            if(currentState === 'running') {
                $interval.cancel(tickIntervalId);
            }

            //  Completely recreate the simulation.
            simulation = new LangtonsAnt();
            simulation.initialise({states: $scope.states});
            $scope.info.currentTicks = 0;
            $scope.info.currentMinX = 0;
            $scope.info.currentMaxX = 0;
            $scope.info.currentMinY = 0;
            $scope.info.currentMaxY = 0;
            $scope.info.antX = 0;
            $scope.info.antY = 0;

            //  Set the status.
            currentState = 'paused';
            $scope.render();
        };

        $scope.pause = function() {

            //  If we're already paused, there's nothing to do.
            if(currentState === 'paused') {
                return;
            }

            //  Cancel the timer.
            $interval.cancel(tickIntervalId);

            //  Set the status.
            currentState = 'paused';
        };

        $scope.removeState = function(state) {
            var index = $scope.states.indexOf(state);
            if(index !== -1) {
                $scope.states.splice(index, 1);
            }
        };

        $scope.addState = function() {
            $scope.states.push($scope.newState);
            $scope.newState = {direction:'L', colour:"#FFFFFF"};
        };

        $scope.moveLeft = function(tiles) {
            $scope.offsetX -= tiles || 1;
        };
        $scope.moveRight = function(tiles) {
            $scope.offsetX += tiles || 1;
        };
        $scope.moveUp = function(tiles) {
            $scope.offsetY -= tiles || 1;
        };
        $scope.moveDown = function(tiles) {
            $scope.offsetY += tiles || 1;
        };
    });