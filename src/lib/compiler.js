function parseDirection(direction) {
  switch(direction) {
    case '0': return 0;
    case 'R': return 90;
    case 'r': return 90;
    case '90': return 90;
    case 'L': return -90;
    case 'l': return -90;
    case '-90': return -90;
    case 'U': return 180;
    case 'u': return 180;
    case '180': return 180;
    case '-180': return 180;
    default: throw new Error(`Compiler Error: ${direction} is not a valid direction`);
  }
}

function expandSemicolons(input) {
  return input.replace(/;/g, '\n');
}

function trimWhitespace(input) {
  return input
    .split('\n')
    .map(l => l.replace(/\s/g, ''))
    .filter(l => l !== '')
    .join('\n');
}

function expandShorthand(input) {
  //  If we have anything which is not L or R, we are already expanded.
  if (input.match(/^[LRlr]+$/) === null) return input;

  return Array.from(input).map(i => `(0,${i},1)`).join();
}

function normaliseTuples(input) {
  return input
    //  Remove brackets like this a,b,c)(d,e,f), replace with split
    .replace(/\)\(/g, '|')
    //  Remove brackets like this a,b,c),(d,e,f), replace with split
    .replace(/\),\(/g, '|')
    //  Now that's done, all other brackets can go.
    .replace(/[()]/g, '');
}

function buildRow(input) {
  //  Get the elements.
  const elements = input.split('|');

  //  Map each element.
  return elements.map((e) => {
    const components = e.split(',');
    if (components.length !== 3) {
      throw new Error(`Compiler Error: Element ${e} is not a three-tuple`);
    }

    return {
      ant: Number.parseInt(components[0]),
      direction: parseDirection(components[1]),
      tile: Number.parseInt(components[2]),
    };
  });
}

function buildMatrix(input) {
  
  //  Split into rows, take each row and and build the matrix line.
  const matrix = input.split('\n').map(buildRow);

  //  Check we have enough states for the rank/order.
  const order = matrix[0].length;
  matrix.forEach((row) => {
    if (row.length !== order) {
      throw new Error('Compiler Error: Matrix is not rectangular');
    }
  });

  return matrix;
}

function compiler(transformation) {
  if (!transformation) throw new Error('Transformation input is required');

  const lined = expandSemicolons(transformation);
  const trimmed = trimWhitespace(lined);
  const expanded = expandShorthand(trimmed);
  const normalised = normaliseTuples(expanded);
  const matrix = buildMatrix(normalised);

  return matrix;
}

module.exports = {
  parseDirection,
  expandSemicolons,
  trimWhitespace,
  expandShorthand,
  normaliseTuples,
  buildMatrix,
  compiler
};
