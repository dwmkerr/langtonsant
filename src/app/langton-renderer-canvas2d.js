function drawAxies(context, axisLength) {
  context.strokeStyle="#FF000022";
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(axisLength, 0);
  context.closePath();
  context.stroke();
  context.strokeStyle="#00FF0022";
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, axisLength);
  context.closePath();
  context.stroke();
}

function drawTicks(context, pos, message) {
  context.font = '18pt Courier New';
  context.fillStyle = 'black';
  context.fillText(message, pos.x, pos.y);
}

/**
 * render - renders the universe to a 2D canvas.
 *
 * @param langtonsAnt - the universe.
 * @param canvas - The 2D canvas.
 * @param options - The rendering options (all optional).
 * @returns {undefined} - Nothing is returned.
 */
function render(langtonsAnt, canvas, options) {

  //  Grab our options.
  //  TODO; support defaults.
  const {
    zoomFactor,
    offsetX,
    offsetY
  } = options;

  //  TODO: here if we adjust origins to full pixels, we'll avoid blur.

  //  Drawing style.
  const backgroundColour = '#FFFFFF';

  //  Size constants.
  const w = canvas.width;
  const h = canvas.height;
  const wHalf = w / 2;
  const hHalf = h / 2;

  //  Bounds constants.
  const left = -wHalf;
  const right = wHalf;
  const top = hHalf;
  const bottom = -hHalf;

  //  We're going to draw each square with a given edge size
  const baseTileSize = 25;
  const tileSize = baseTileSize * zoomFactor;
  const halfTileSize = tileSize / 2;

  //  Get the drawing context.
  var ctx = canvas.getContext("2d");

  //  Clear the background.
  ctx.fillStyle = backgroundColour;
  ctx.fillRect(0, 0, w, h);

  //  Clear, then save the current transformation, then adjust the coordinates
  //  so that the origin is at the center of the canvas.
  ctx.save();
  ctx.scale(1,-1);
  ctx.translate(wHalf, -h + hHalf);

  //  Draw the axis.
  ctx.save();
  ctx.translate(-offsetX * tileSize, -offsetY * tileSize);
  drawAxies(ctx, tileSize * 5);
  ctx.restore();

  //  Work out how many tiles we'll draw and the low/high
  //  tile values (we basically want one more than will fit on the
  //  canvas in each direction).
  var xTiles = Math.floor(w / tileSize) + 2,
    yTiles = Math.floor(h / tileSize) + 2,
    xFirst = Math.floor(-xTiles/2) - 1,
    xLast = -xFirst + 1,
    yFirst = Math.floor(-yTiles/2) - 1,
    yLast = -yFirst + 1;

  //  Rather than calculating the position of each tile each time, calculate the
  //  top left part of the top left tile and just nudge it each time.
  var xPos = xFirst*tileSize - halfTileSize + 1,
    yPos = yFirst*tileSize - halfTileSize + 1;

  //  Apply the offset.
  xFirst += offsetX;
  xLast += offsetX;
  yFirst += offsetY;
  yLast += offsetY;

  //  Draw the grid.
  ctx.strokeStyle="#00000011";
  for (let v = xFirst; v <= xLast; v++) {
    ctx.beginPath();
    ctx.moveTo(((v - offsetX) * tileSize) - halfTileSize, bottom);
    ctx.lineTo(((v - offsetX) * tileSize) - halfTileSize, top);
    ctx.closePath();
    ctx.stroke();
  }
 for (let h = yFirst; h <= yLast; h++) {
    ctx.beginPath();
    ctx.moveTo(left, ((h - offsetY) * tileSize) - halfTileSize);
    ctx.lineTo(right, ((h - offsetY) * tileSize) - halfTileSize);
    ctx.closePath();
    ctx.stroke();
  }

  //  Start drawing those tiles.
  var yCarriageReturn = yPos;
  for(var x = xFirst; x <= xLast; x++) {
    for(var y = yFirst; y<= yLast; y++) {

      //  Get the tile state.
      var state = langtonsAnt.getTileState(x, y);

      //  Draw the tile, but only if it's not the background color.
      if(state.colour != backgroundColour) {
        ctx.fillStyle = state.colour;
        ctx.fillRect(xPos, yPos, tileSize - 1, tileSize - 1);
      }
      yPos += tileSize;
    }
    xPos += tileSize;
    yPos = yCarriageReturn;
  }

  //  Draw the ant.
  var antX = langtonsAnt.antPosition.x * tileSize,
    antY = langtonsAnt.antPosition.y * tileSize;

  ctx.fillStyle = '#ff0000';

  //  Tranform before we draw the ant, it makes it easier.
  ctx.save();
  ctx.translate(-offsetX * tileSize, -offsetY * tileSize);
  ctx.translate(antX, antY);
  ctx.scale(zoomFactor, zoomFactor);
  ctx.rotate((langtonsAnt.antDirection / 180) * Math.PI);
  ctx.beginPath();
  ctx.moveTo(-(baseTileSize-8)/2, -(baseTileSize-4)/2);
  ctx.lineTo(+(baseTileSize-8)/2, -(baseTileSize-4)/2);
  ctx.lineTo(0, (baseTileSize-4)/2);
  ctx.fill();
  ctx.closePath();
  ctx.restore();

  //  Back to normal coordinates.
  ctx.restore();

  //  Draw the ticks.
  drawTicks(ctx, { x: 20, y: h - 10 - 16 }, langtonsAnt.ticks);
}

/**
 * hitTest - given a canvas, universe and options, performs a hit test,
 * returning the tile at the given position.
 *
 * @param langtonsAnt - the universe.
 * @param canvas - The 2D canvas.
 * @param options - The rendering options (all optional).
 * @param position - The { x, y } coordinates.
 * @returns {undefined} - Nothing is returned.
 */
function hitTest(langtonsAnt, canvas, options, pos) {
  const {
    zoomFactor,
    offsetX,
    offsetY
  } = options;

  //  TODO: here if we adjust origins to full pixels, we'll avoid blur.

  //  Size constants.
  const w = canvas.width;
  const h = canvas.height;
  const wHalf = w / 2;
  const hHalf = h / 2;

  //  Get the adjusted coordinates.
  const baseTileSize = 25;
  const tileSize = baseTileSize * zoomFactor;
  const x = pos.x + (tileSize / 2) - wHalf;
  const y = pos.y - (tileSize / 2) - hHalf;

  return {
    x: Math.floor(x / tileSize),
    y: Math.floor(-y / tileSize),
  };
}

module.exports = { render, hitTest };
