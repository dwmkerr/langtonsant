import { render, hitTest } from './langton-renderer-canvas2d';

/*
    Langton's Ant

    The Langton's Ant class represents a Langton's Ant simulation. It is 
    initialised with a call to 'Initialise', providing all configuration
    and erasing any state. The simulation can then be 'ticked', forwards
    or backwards.
*/

function LangtonsAnt() {

    //  The position of the ant.
    this.antPosition = {x: 0, y: 0};

    //  The direction of the ant, in degrees clockwise from north.
    this.antDirection = 0;

    //  A set of all tiles. The value for each tile is its state index.
    //  We also have a set of tile states.
    this.tiles = [];
    this.states = [];
    
    //  The bounds of the system.
    this.bounds = {
        xMin: 0,
        xMax: 0,
        yMin: 0,
        yMax: 0
    };

    //  The number of ticks.
    this.ticks = 0;

    //  Initialises a universe. If we include a configuration
    //  value, we can override the states.
    this.initialise = function (configuration) {

        //  Reset the tiles, ant and states.
        this.antPosition = {
            x: 0,
            y: 0
        };
        this.antDirection = 0;
        this.tiles = [];
        this.bounds = {
            xMin: 0,
            xMax: 0,
            yMin: 0,
            yMax: 0
        };
        this.states = [];

        //  If we have no states, create our own.
        if(configuration.states !== undefined) {
            this.states = configuration.states;
        } else {
            this.states = [
                {direction: 'L', colour: '#FFFFFF'}, 
                {direction: 'R', colour: '#000000'}
            ];
        }
    };

    //  Gets a tile state index. If we don't have a state, return the
    //  default (zero), otherwise return the state from the tiles array.
    this.getTileStateIndex = function(x, y) {
        if(this.tiles[x] === undefined) {
            this.tiles[x] = [];
        }
        var stateIndex = this.tiles[x][y];
        return stateIndex === undefined ? 0 : stateIndex;
    };

    //  Gets a tile state.
    this.getTileState = function(x, y) {
        return this.states[this.getTileStateIndex(x, y)];
    };

    //  Set a tile state index.
    this.setTileStateIndex = function(x, y, stateIndex) {
        if(this.tiles[x] === undefined) {
            this.tiles[x] = [];
        }
        this.tiles[x][y] = stateIndex;

        //  Update the bounds of the system.
        if(x < this.bounds.xMin) {this.bounds.xMin = x;}
        if(x > this.bounds.xMax) {this.bounds.xMax = x;}
        if(y < this.bounds.yMin) {this.bounds.yMin = y;}
        if(y > this.bounds.yMax) {this.bounds.yMax = y;}
    };

    //  Advance a tile states.
    this.advanceTile = function(x, y) {
        //  Get the state index, increment it, roll over if we pass
        //  over the last state and update the tile state.
        var stateIndex = this.getTileStateIndex(x, y)+1;
        stateIndex %= this.states.length;
        this.setTileStateIndex(x, y, stateIndex);
    };

    //  Take a step forwards.
    this.stepForwards = function() {

        //  Get the state of the tile that the ant is on, this'll let
        //  us determine the direction to move in.
        var state = this.getTileState(this.antPosition.x, this.antPosition.y);

        //  Change direction.
        if(state.direction === 'L') {
            this.antDirection -= 90;
        } else if(state.direction === 'R') {
            this.antDirection += 90;
        }
        this.antDirection %= 360;

        //  Now we can advance the tile.
        this.advanceTile(this.antPosition.x, this.antPosition.y);

        //  Move the ant.
        if(this.antDirection === 0) {
            this.antPosition.y++;
        } else if (this.antDirection === 90 || this.antDirection === -270) {
            this.antPosition.x--;
        } else if (this.antDirection === 180 || this.antDirection === -180) {
            this.antPosition.y--;
        }
        else {
            this.antPosition.x++;
        }

        this.ticks++;
    };

    //  Render the simulation.
    this.render = function(canvas, options) {
      //  Use the 2D rendering function.
      render(this, canvas, {
        zoomFactor: options.zoomFactor,
        offsetX: options.offsetX,
        offsetY: options.offsetY
      });
    };

}

export default LangtonsAnt;
