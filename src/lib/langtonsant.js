function between(val, low, high) {
  const raw = (val - low) % (high - low);
  return raw < low ? high + raw : raw + low;
}

/*
    Langton's Ant

    The Langton's Ant class represents a Langton's Ant simulation. It is 
    initialised with a call to 'Initialise', providing all configuration
    and erasing any state. The simulation can then be 'ticked', forwards
    or backwards.
    */

function LangtonsAnt(configuration) {
  if (!configuration) throw new Error('\'configuration\' is required');
  if (!configuration.transformationMatrix) throw new Error('\'configuration.transformationMatrix\' is required');

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

  this.transformationMatrix = configuration.transformationMatrix;

  //  Get a tile state. Tiles which have not yet been touched have state zero.
  this.getTileState = function(x, y) {
    if(this.tiles[x] === undefined) {
      return 0;
    }
    return this.tiles[x][y] || 0;
  };

  //  Set a tile state.
  this.setTileState = function(x, y, state) {
    if(this.tiles[x] === undefined) {
      this.tiles[x] = [];
    }
    this.tiles[x][y] = state;

    //  Update the bounds of the system.
    if(x < this.bounds.xMin) {this.bounds.xMin = x;}
    if(x > this.bounds.xMax) {this.bounds.xMax = x;}
    if(y < this.bounds.yMin) {this.bounds.yMin = y;}
    if(y > this.bounds.yMax) {this.bounds.yMax = y;}
  };

  //  For a given ant/tile state, get the transformation.
  this.getTransformation = function(antState, x, y) {
    //  Get the state of the tile. Then get the transformation.
    const tileState = this.getTileState(x, y);
    return this.transformationMatrix[antState][tileState];
  };

  //  Advance a tile state. Defaults to +1, but you can advance multiple
  //  steps, or even backwards.
  this.advanceTile = function(x, y, direction = 1) {
    //  Get the state, increment it, roll over if we pass
    //  over the last and update the tile state.

    var state = this.getTileState(x, y) + direction;
    this.setTileState(x, y, between(state, 0, this.transformationMatrix[0].length));
  };

  //  Take a step forwards.
  this.stepForwards = () => {

    //  Get the transformation.
    var transformation = this.getTransformation(this.antState, this.antPosition.x, this.antPosition.y);

    //  Change tile, direction and ant.
    this.advanceTile(this.antPosition.x, this.antPosition.y, transformation.tile);
    this.antDirection = between(this.antDirection + transformation.direction, 0, 360);
    this.antState = between(this.antState + transformation.ant, 0, this.transformationMatrix.length);

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

    //  Get the transformation.
    var transformation = this.getTransformation(this.antState, this.antPosition.x, this.antPosition.y);

    //  Change tile, direction and ant (all backwards).
    this.advanceTile(this.antPosition.x, this.antPosition.y, -transformation.tile);
    this.antDirection = between(this.antDirection - transformation.direction, 0, 360);
    this.antState = between(this.antState - transformation.ant, 0, this.transformationMatrix.length);
  };
}

module.exports = LangtonsAnt;
