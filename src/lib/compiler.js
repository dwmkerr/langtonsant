function parseDirection(direction) {
  switch(direction) {
    case '0': return 0;
    case 'R': return 90;
    case '90': return 90;
    case 'L': return -90;
    case '-90': return -90;
    case 'U': return 180;
    case '180': return 180;
    case '-180': return 180;
    default: throw new Error(`Compiler Error: ${direction} is not a valid direction`);
  }
}

function trimWhitespace(input) {
  return input.replace(/\s/g, '');
}

function expandShorthand(input) {
  //  If we have anything which is not L or R, we are already expanded.
  if (input.match(/^[LR]+$/) === null) return input;

  //  Just build the tuples from the input.
  let program = '';
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    const next = i + 1;
    program += `(0,${c},${next === input.length ? 0 : next})`;
  }

  return program;
}

function normaliseTuples(input) {
  return input
    //  Remove brackets like this a,b,c)(d,e,f), replace with comma
    .replace(/\)\(/g, ',')
    //  Now that's done, all other brackets can go.
    .replace(/[()]/g, '');
}

function buildMatrix(input) {
  //  Take the input, to get all of the elements.
  const elements = input.split(',');
  const l = elements.length;

  //  If we do not have three tuples, throw.
  if ((l % 3) !== 0) {
    throw new Error(`Compiler Error: ${l} elements is not an integer number of three tuples (e.g. '(a,b,c), (d,e,f)')`);
  }

  //  Go though each tuple to build the matrix.
  const matrix1d = [];
  let rank = 0;
  let order = 0;
  for (let i=0; i<l; ) {
    //  Decode elements, add to the 1d matrix.
    const ant = Number.parseInt(elements[i++]);
    const direction = parseDirection(elements[i++]);
    const tile = Number.parseInt(elements[i++]);
    matrix1d.push({
      changeAnt: ant,
      changeDirection: direction,
      changeTile: tile
    });

    //  Check rank and order.
    if ((tile + 1) > rank) rank = tile + 1; // states are zero based, but ranks
    if ((ant + 1) > order) order = ant + 1; // and orders start from one
  }

  //  Check we have enough states for the rank/order.
  const states = matrix1d.length;
  if (states !== (rank * order)) {
    throw new Error(`Compiler Error: Input indicates matrix is ${rank}x${order} and ${states} states have been provided, ${rank*order} states are required`);
  }

  //  Now create a 2d matrix from our 1d matrix.
  const matrix2d = [];
  for (let o = 0; o < order; o++) {
    matrix2d.push(matrix1d.splice(0, rank));
  }

  return matrix2d;
}

function compiler(transformation) {
  if (!transformation) throw new Error('Transformation input is required');

  const trimmed = trimWhitespace(transformation);
  const expanded = expandShorthand(trimmed);
  const normalised = normaliseTuples(expanded);
  const matrix = buildMatrix(normalised);

  return matrix;
}

module.exports = {
  parseDirection,
  trimWhitespace,
  expandShorthand,
  normaliseTuples,
  buildMatrix,
  compiler
};
