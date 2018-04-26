export default function compile(transformation) {
  if (!transformation) throw new Error('Transformation input is required');

  //  Go through the transformation string, decoding L/R into transformations.
  const matrix = []; // all ant states.
  matrix[0] = [];    // states for ant state 0.

  //  Decode the string.
  for(let i = 0; i < transformation.length; i++) {
    const element = transformation[i];
    switch(element) {
      case 'L':
        matrix[0][i] = {
          changeAnt: +0,
          changeDirection: -90,
          changeTile: +1
        }
        break;
      case 'R':
        matrix[0][i] = {
          changeAnt: +0,
          changeDirection: 90,
          changeTile: +1
        }
        break;
      default:
        throw new Error(`Unrecognised element ${element} at position ${i} when compiling ${transformation}`);
    }
  }

  return matrix;
}
