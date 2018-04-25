import { render, hitTest } from './langton-renderer-canvas2d';

/*
    Langton's Ant

    The Langton's Ant class represents a Langton's Ant simulation. It is 
    initialised with a call to 'Initialise', providing all configuration
    and erasing any state. The simulation can then be 'ticked', forwards
    or backwards.
    */

function LangtonsAnt(configuration) {

  //  The position of the ant. The state is used for termites.
  this.antPosition = {x: 0, y: 0};
  this.antState = 0;

  //  The direction of the ant, in degrees clockwise from north.
  this.antDirection = 0;

  //  A set of all tiles. 
  this.tiles = [];

  //  The bounds of the system.
  this.bounds = {
    xMin: 0,
    xMax: 0,
    yMin: 0,
    yMax: 0
  };

  //  The number of ticks.
  this.ticks = 0;

  //  Set the states, which cn be provided in the config.
  if(configuration && configuration.states !== undefined) {
    this.states = configuration.states;
  } else {
    this.states = [
      { turn: -90, tileState: +1 }, // i.e. Left, Next Tile
      { turn: 90, tileState: +1 }   // i.e. Right, Next Tile
    ];
  }

  //  Set the termite states, which can also be provided in the config.
  if(configuration && configuration.termiteStates !== undefined) {
    this.termiteStates = configuration.termiteStates;
  } else {
    this.termiteStates = [];
    this.termiteStates[0] = [// ant state 0
      { antState: +1, turn: 90, tileState: +0 },
      { antState: +0, turn: 90, tileState: +1 },
    ];
    this.termiteStates[1] = [// ant state 0
      { antState: +0, turn: 0, tileState: -1 },
      { antState: -1, turn: 0, tileState: +1 },
    ];
  }

  //  Gets a tile state index. If we don't have a state, return the
  //  default (zero), otherwise return the state from the tiles array.
  this.getTileStateIndex = function(x, y) {
    if(this.tiles[x] === undefined) {
      return 0;
    }
    return this.tiles[x][y] || 0;
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

  //  Advance a tile state. Defaults to +1, but you can advance multiple
  //  steps, or even backwards.
  this.advanceTile = function(x, y, direction = 1) {
    //  Get the state index, increment it, roll over if we pass
    //  over the last state and update the tile state.
    var stateIndex = this.getTileStateIndex(x, y) + direction;
    stateIndex %= this.states.length;
    this.setTileStateIndex(x, y, stateIndex);
  };

  //  Take a step forwards.
  this.stepForwards = () => {

    //  Get the state of the tile that the ant is on, this'll let
    //  us determine the direction to move in.
    var state = this.getTileState(this.antPosition.x, this.antPosition.y);

    //  Turn the ant.
    this.antDirection += state.turn;
    this.antDirection %= 360;

    //  Now we can advance the tile.
    this.advanceTile(this.antPosition.x, this.antPosition.y, state.tileState || +1);

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

  //  Take a step backwards.
  this.stepBackwards = function() {
    if (this.ticks === 0) return;

    //  Move time backwards.
    this.ticks--;

    //  Move the ant backwards.
    if(this.antDirection === 0) {
      this.antPosition.y--;
    } else if (this.antDirection === 90 || this.antDirection === -270) {
      this.antPosition.x++;
    } else if (this.antDirection === 180 || this.antDirection === -180) {
      this.antPosition.y++;
    }
    else {
      this.antPosition.x--;
    }

    //  Now we can advance the tile backwards.
    this.advanceTile(this.antPosition.x, this.antPosition.y, -state.tileState || -1);

    //  Get the state of the tile that the ant is on, this'll let
    //  us determine the direction to move in.
    var state = this.getTileState(this.antPosition.x, this.antPosition.y);

    //  Turn, backwards.
    this.antDirection -= state.turn;
    this.antDirection %= 360;
  };
}

export default LangtonsAnt;
