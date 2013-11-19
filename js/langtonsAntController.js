function LangtonsAntController($scope) {

    //  The timer id.
    $scope.intervalId = null;

    //  The simulation object.
    $scope.simulation = new LangtonsAnt();


    //  Starts the simulation.
    $scope.start = function() {

        $scope.canvas = document.getElementById("antcanvas");

        //  Initialise the simulation.
        $scope.simulation.initialise({});

        //  Start the timer.
        $scope.intervalId = window.setInterval($scope.timerProc, 100);
    };

    //  Stops the simulation.
    $scope.stop = function() {

    };

    //  Ticks the simulation.
    $scope.timerProc = function() {
        $scope.simulation.stepForwards();
        $scope.simulation.render($scope.canvas);
    }
}