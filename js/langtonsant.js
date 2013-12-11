/*
	Langton's Ant

	The Langton's Ant class represents a Langton's Ant simulation. It is 
	initialised with a call to 'Initialise', providing all configuration
	and erasing any state. The simulation can then be 'ticked', forwards
	or backwards.
*/

function LangtonsAnt() {

	//	First, create all of the variables we use in the class.

	//	The position of the ant.
	this.antPosition = {
		x: 0,
		y: 0
	};

	//	The direction of the ant, in degrees clockwise from north.
	this.antDirection = 0;

	//	A set of all tiles. The value for each tile is its state index.
	this.tiles = [];
	
	//	The bounds of the system.
	this.bounds = {
		xMin: 0,
		xMax: 0,
		yMin: 0,
		yMax: 0
	};

	//	The number of ticks.
	this.ticks = 0;

    //  The offset.
    this.offsetX = 0;
    this.offsetY = 0;

	//	Gets a tile state index.
	this.getTileStateIndex = function(x, y) {
		if(this.tiles[x] === undefined) {
			this.tiles[x] = [];
		}
		var stateIndex = this.tiles[x][y];
		return stateIndex === undefined ? 0 : stateIndex;
	};

	//	Gets a tile state.
	this.getTileState = function(x, y) {
		return this.states[this.getTileStateIndex(x, y)];
	}

	//	Set a tile state index.
	this.setTileStateIndex = function(x, y, stateIndex) {
		if(this.tiles[x] === undefined) {
			this.tiles[x] = [];
		}
		this.tiles[x][y] = stateIndex;

		//	Update the bounds of the system.
		if(x < this.bounds.xMin) {this.bounds.xMin = x;}
		if(x > this.bounds.xMax) {this.bounds.xMax = x;}
		if(y < this.bounds.yMin) {this.bounds.yMin = y;}
		if(y > this.bounds.yMax) {this.bounds.yMax = y;}
	};

	//	Advance a tile states.
	this.advanceTile = function(x, y) {
		var stateIndex = this.getTileStateIndex(x, y);
		stateIndex++;
		if(stateIndex == this.states.length) {
			stateIndex = 0;
		}
		this.setTileStateIndex(x, y, stateIndex);
	};

	//	Take a step forwards.
	this.stepForwards = function() {

		//	Get the state of the tile that the ant is on and update that tile.
		var state = this.getTileState(this.antPosition.x, this.antPosition.y);
		this.advanceTile(this.antPosition.x, this.antPosition.y);

		//	Change direction.
		if(state.direction === 'L') {
			this.antDirection -= 90;
		} else if(state.direction === 'R') {
			this.antDirection += 90;
		}
		this.antDirection %= 360;

		//	Move the ant.
		if(this.antDirection === 0) {
			this.antPosition.y++;
		} else if (this.antDirection === 90 || this.antDirection === -270) {
			this.antPosition.x++;
		} else if (this.antDirection === 180 || this.antDirection === -180) {
			this.antPosition.y--;
		}
		else {
			this.antPosition.x--;
		}
		this.ticks++;
	};

	this.initialise = function (configuration) {

		//	Reset the tiles, ant and states.
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
        this.offsetX = 0;
        this.offsetY = 0;

		//	If we have no states, create our own.
		if(configuration.states !== undefined) {
			this.states = configuration.states;
		} else {
			this.states = [
				{direction: 'L', colour: '#FFFFFF'}, 
				{direction: 'R', colour: '#000000'}
			];
		}
	};

    this.render = function(canvas) {

        //	Get the drawing context.
        var ctx = canvas.getContext("2d");

        //	Draw the background.
        var backgroundColour = '#FFFFFF'
        ctx.fillStyle = backgroundColour;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //	We're going to draw each square with a given edge size.
        var tileSize = 25;

        //	Useful variables for when we're drawing...
        var width = canvas.width,
        	height = canvas.height,
        	originX = width/2,
        	originY = height/ 2,
            halfTileSize = tileSize/2;

        //  Work out how many tiles we'll draw and the low/high
        //  tile values (we basically want one more than will fit on the
        //  canvas in each direction).
        var xTiles = Math.floor(canvas.width / tileSize) + 2,
        	yTiles = Math.floor(canvas.height / tileSize) + 2,
        	xFirst = Math.floor(-xTiles/2) - 1,
        	xLast = -xFirst + 1,
        	yFirst = Math.floor(-yTiles/2) - 1,
        	yLast = -yFirst + 1;

        //  Rather than calculating the position of each time each time, calculate the
        //  top left part of the top left tile and just nudge it each time.
        var xPos = originX + xFirst*tileSize - halfTileSize + 1,
            yPos = originY + yFirst*tileSize - halfTileSize + 1;

        //	Start drawing those tiles.
        for(var x = xFirst; x <= xLast; x++) {
        	for(var y = yFirst; y<= yLast; y++) {

        		//	Get the tile state.
        		var state = this.getTileState(x, y);

        		//	Draw the tile, but only if it's not the background color.
        		if(state.colour != backgroundColour) {
        			ctx.fillStyle = state.colour;
        			ctx.fillRect(xPos, yPos, tileSize - 1, tileSize - 1);
        		}
        		yPos += tileSize;
        	}
        	xPos += tileSize;
        	yPos = originY + yFirst*tileSize - halfTileSize + 1;;
        }

        //	Draw the ant.
        var antX = originX + this.antPosition.x * tileSize,
            antY = originY + this.antPosition.y * tileSize;

       	ctx.fillStyle = '#ff0000';
       	ctx.fillRect(antX - 8, antY - 8, 16, 16);

        ctx.moveTo(originX-50,originY);
        ctx.lineTo(originX+50,originY);
        ctx.moveTo(originX,originY-50);
        ctx.lineTo(originX,originY+50);
        ctx.stroke();
    };
}