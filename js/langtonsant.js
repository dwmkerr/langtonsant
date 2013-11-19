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

	//	A set of all tiles. The value for each tile is its state.
	this.tiles = [];

	//	The bounds of the system.
	this.bounds = {
		xMin: 0,
		xMax: 0,
		yMin: 0,
		yMax: 0
	};

	//	Gets a tile state.
	this.getTile = function(x, y) {
		if(this.states[x] === undefined) {
			this.states[x] = [];
		}
		var state = this.states[x][y];
		return state === undefined ? 0 : state;
	};

	//	Set a tile state.
	this.setTile = function(x, y, state) {
		if(this.tiles[x] === undefined) {
			this.tiles[x] = [];
		}
		this.tiles[x][y] = state;

		//	Update the bounds of the system.
		if(x < this.bounds.xMin) {this.bounds.xMin = 0;}
		if(x > this.bounds.xMax) {this.bounds.xMin = 0;}
		if(y < this.bounds.yMin) {this.bounds.yMax = 0;}
		if(y > this.bounds.yMax) {this.bounds.yMax = 0;}
	};

	//	Advance a tile states.
	this.advanceTile = function(x, y) {
		var state = this.getTile(x, y);
		state++;
		if(state == this.states.length) {
			state = 0;
		}
		this.setTile(x, y, state);
	};

	//	Take a step forwards.
	this.stepForwards = function() {

		//	Get the state of the tile that the ant is on and update that tile.
		var state = this.getTile(this.antPosition.x, this.antPosition.y);
		this.advanceTile(this.antPosition.x, this.antPosition.y);

		//	Change direction.
		if(state === 'L') {
			this.antDirection -= 90;
		} else if(state === 'R') {
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

		//	If we have no states, create our own.
		if(configuration.states !== undefined) {
			this.states = configuration.states;
		} else {
			this.states = ['L', 'R'];
		}
	};

    this.render = function(canvas) {

        //	Get the drawing context.
        var ctx = canvas.getContext("2d");

        //	Draw the background.
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //	Draw stars.
     /*   ctx.fillStyle = '#ffffff';
        for(var i=0; i<this.stars.length;i++) {
            var star = this.stars[i];
            ctx.fillRect(star.x, star.y, star.size, star.size);
        }*/
    };
}