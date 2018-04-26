import compiler from './compiler';

describe('compiler', () => {
  it('should throw with no input', () => {
    expect(() => compiler(undefined)).to.throw(/input/);
  });

  it('should be able to create an LR transformation matrix', () => {
    const input = 'LR';
    const expectedMatrix = [
      [
        { changeAnt: +0, changeDirection: -90, changeTile: +1 },
        { changeAnt: +0, changeDirection: +90, changeTile: +1 },
      ]
    ];

    expect(compiler(input)).to.eql(expectedMatrix);
  });
});
