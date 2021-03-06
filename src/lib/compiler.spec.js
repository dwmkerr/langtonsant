const { expect } = require('chai');

const {
  parseDirection,
  expandSemicolons,
  trimWhitespace,
  expandShorthand,
  normaliseTuples,
  buildMatrix,
  compiler
} = require('./compiler');

describe('compiler', () => {

  describe('parseDirection', () => {
    it('can handle known directions', () => {
      expect(parseDirection('0')).to.eql(0);
      expect(parseDirection('R')).to.eql(90);
      expect(parseDirection('r')).to.eql(90);
      expect(parseDirection('90')).to.eql(90);
      expect(parseDirection('L')).to.eql(-90);
      expect(parseDirection('l')).to.eql(-90);
      expect(parseDirection('-90')).to.eql(-90);
      expect(parseDirection('U')).to.eql(180);
      expect(parseDirection('u')).to.eql(180);
      expect(parseDirection('180')).to.eql(180);
      expect(parseDirection('-180')).to.eql(180);
    });

    it('throws for unknown directions', () => {
      expect(() => parseDirection('CC')).to.throw(/CC is not a valid direction/);
      expect(() => parseDirection('CCW')).to.throw(/CCW is not a valid direction/);
    });
  });

  describe('expandSemicolons', () => {
    it('should replace semicolons with newlines', () => {
      const input = `
(1, L, 1), (1, L, 1);(1, R, 1), (0, 0, 0);;
      `;
      const expectedOutput = `
(1, L, 1), (1, L, 1)
(1, R, 1), (0, 0, 0)


      `;
      expect(expandSemicolons(input)).to.eql(expectedOutput);
    });
  });

  describe('trimWhitespace', () => {
    it('should trim a fibonnaci input correctly', () => {
      const input = ` (1, L, 1), (1, L, 1)
(1, R, 1), (0, 0, 0)
      `;
      const expectedOutput = `(1,L,1),(1,L,1)
(1,R,1),(0,0,0)`;
      expect(trimWhitespace(input)).to.eql(expectedOutput);
    });
    it('should eliminate empty lines', () => {
      const input = `
 (1, L, 1), (1, L, 1)
 (1, R, 1), (0, 0, 0)


      `;
      const expectedOutput = `(1,L,1),(1,L,1)
(1,R,1),(0,0,0)`;
      expect(trimWhitespace(input)).to.eql(expectedOutput);
    });
  });

  describe('expandShorthand', () => {
    it('should not expand a program which is not shorthand', () => {
      const input = '(1,L,1),(1,L,1);(1,R,1),(0,0,0)';
      expect(expandShorthand(input)).to.eql(input);
    });

    it('should expand a simple shorthand program', () => {
      const input = 'LR';
      const expectedOutput = '(0,L,1),(0,R,1)';
      expect(expandShorthand(input)).to.eql(expectedOutput);
    });

    it('should expand a more complex shorthand program', () => {
      const input = 'LRLL';
      const expectedOutput = '(0,L,1),(0,R,1),(0,L,1),(0,L,1)';
      expect(expandShorthand(input)).to.eql(expectedOutput);
    });
  });

  describe('normaliseTuples', () => {
    it('should eliminate brackets', () => {
      const input = `(1,L,1),(1,L,1)
(1,R,1),(0,0,0)`;
      const expectedOutput = `1,L,1|1,L,1
1,R,1|0,0,0`;
      expect(normaliseTuples(input)).to.eql(expectedOutput);
    });

    it('should eliminate brackets even when commas between tuples are missing', () => {
      //  Note that the middle two tuples have no brackets between them...
      const input = `(1,L,1),(1,L,1)
(1,R,1),(0,0,0)`;
      const expectedOutput = `1,L,1|1,L,1
1,R,1|0,0,0`;
      expect(normaliseTuples(input)).to.eql(expectedOutput);
    });
  });

  describe('buildMatrix', () => {
    it('should check for three tuples', () => {
      //  Note that the last number is a two tuple.
      const input = '1,L,1|1,L,1|1,R,1|0,0';
      expect(() => buildMatrix(input)).to.throw(/three-tuple/);
    });

    it('should check for rectangular matrix', () => {
      //  Note that we have two ant states but three tile states, and therefore
      //  not enough tuples to make a 2x3 matrix
      const input = `1,L,1|1,L,1
1,R,1|0,0,2
1,R,1|0,0,2|0,0,2`;
      expect(() => buildMatrix(input)).to.throw(/not rectangular/);
    });

    it('build a matrix with the correct rank and order', () => {
      const input = `1,L,1|1,L,1
1,R,1|0,0,2`;
      const matrix = buildMatrix(input);
      expect(matrix.length).to.equal(2);    // order 2, i.e. 2 rows for 2 ant states
      expect(matrix[0].length).to.equal(2);  // rank 2, i.e. 2 ranks for 2 tile states
      expect(matrix[1].length).to.equal(2);  // rank 2, i.e. 2 ranks for 2 tile states
    });
  });

  describe('compiler', () => {
    it('should throw with no input', () => {
      expect(() => compiler(undefined)).to.throw(/input/);
    });

    it('should be able to create an LR transformation matrix', () => {
      const input = '0,L,1|0,R,1';
      const expectedMatrix = [
        [
          { ant: 0, direction: -90, tile: 1 },
          { ant: 0, direction: +90, tile: 1 },
        ]
      ];

      expect(compiler(input)).to.eql(expectedMatrix);
    });

    it('should be able to create an LR transformation matrix from shorthand', () => {
      const input = 'LR';
      const expectedMatrix = [
        [
          { ant: 0, direction: -90, tile: 1 },
          { ant: 0, direction: +90, tile: 1 },
        ]
      ];

      expect(compiler(input)).to.eql(expectedMatrix);
    });

    it('should be able to create an LRLL transformation matrix from shorthand', () => {
      const input = 'LRLL';
      const expectedMatrix = [
        [
          { ant: 0, direction: -90, tile: 1 },
          { ant: 0, direction: +90, tile: 1 },
          { ant: 0, direction: -90, tile: 1 },
          { ant: 0, direction: -90, tile: 1 },
        ]
      ];

      const matrix = compiler(input);

      expect(matrix.length).to.eql(1);
      expect(matrix[0].length).to.eql(4);
      expect(matrix).to.eql(expectedMatrix);
    });

    it('should be able to create Fibonacci Spiral Transformation matrix', () => {
      const input = `
      (1, L, 1), (1, L, 1)
      (1, R, 1), (0, 0, 0)
    `;
      const expectedMatrix = [
        [
          { ant: 1, direction: -90, tile: 1 },
          { ant: 1, direction: -90, tile: 1 },
        ],
        [
          { ant: 1, direction: 90, tile: 1 },
          { ant: 0, direction: 0, tile: 0 },
        ]
      ];

      expect(compiler(input)).to.eql(expectedMatrix);
    });
  });
});
