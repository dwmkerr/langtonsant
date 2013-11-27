function LangtonsAntController($scope) {

    //  The current state - stopped, started, or paused.
    $scope.currentState = "stopped";

    //  The frequencies of the two tick functions.
    $scope.tickFrequency = 10;
    $scope.drawFrequency = 10;

    //  The timer id.
    $scope.tickIntervalId = null;
    $scope.drawIntervalId = null;

    //  The simulation object.
    $scope.simulation = new LangtonsAnt();

    //  Starts the simulation.
    $scope.start = function() {

        $scope.canvas = document.getElementById("antcanvas");

        //  Initialise the simulation.
        $scope.simulation.initialise({});

        //  Start the timer.
        $scope.tickIntervalId = window.setInterval($scope.tickProc, 1000 / $scope.tickFrequency);
        $scope.drawIntervalId = window.setInterval($scope.drawProc, 1000 / $scope.drawFrequency);
    };

    //  Stops the simulation.
    $scope.stop = function() {
        window.clearInterval($scope.tickIntervalId);
        window.clearInterval($scope.drawIntervalId);
    };

    //  Ticks the simulation.
    $scope.tickProc = function() {
        $scope.simulation.stepForwards();
    };
    $scope.drawProc = function() {
        $scope.simulation.render($scope.canvas);
    };
}