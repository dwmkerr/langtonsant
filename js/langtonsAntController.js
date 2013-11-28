function LangtonsAntController($scope, $interval) {

    //  The current state - stopped, started, or paused.
    $scope.currentState = "stopped";

    //  Tick frequency.
    $scope.tickFrequency = 10;

    //  The timer id.
    $scope.tickIntervalId = null;

    //  States.
    $scope.states = [
    {direction:'L', colour: '#FFFFFF'},
    {direction:'R', colour: '#000000'}
    ];

    //  The simulation object.
    $scope.simulation = new LangtonsAnt();
    $scope.simulation.initialise({states: $scope.states});

    //  Simulation info.
    $scope.currentTicks = 0;
    $scope.currentMinX = 0;
    $scope.currentMaxX = 0;
    $scope.currentMinY = 0;
    $scope.currentMaxY = 0;
    $scope.antX = 0;
    $scope.antY = 0;

    //  Get the canvas.
    $scope.canvas = document.getElementById("antcanvas");

    //  Starts the simulation.
    $scope.start = function() {

        //  Start the timer.
        $scope.simulation.initialise({states: $scope.states});
        $scope.tickIntervalId = $interval($scope.tickProc, 1000 / $scope.tickFrequency);
    };

    $scope.pause = function() {
        $interval.cancel($scope.tickIntervalId);
    };

    $scope.resume = function() {
        $scope.tickIntervalId = $interval($scope.tickProc, 1000 / $scope.tickFrequency);
    };

    //  Stops the simulation.
    $scope.stop = function() {
        $interval.cancel($scope.tickIntervalId);
    };

    //  Ticks the simulation.
    $scope.tickProc = function() {
        $scope.simulation.stepForwards();
        $scope.currentTicks = $scope.simulation.ticks;
        $scope.currentMinX = $scope.simulation.bounds.xMin;
        $scope.currentMaxX = $scope.simulation.bounds.xMax;
        $scope.currentMinY = $scope.simulation.bounds.yMin;
        $scope.currentMaxY = $scope.simulation.bounds.yMax;
        $scope.antX = $scope.simulation.antPosition.x;
        $scope.antY = $scope.simulation.antPosition.y;
        $scope.render();
    };

    $scope.render = function() {
        $scope.simulation.render($scope.canvas);
    };
}