const { expect } = require('chai');
const langtonsant = require('./langtonsant');

describe('langtonsant', () => {
  it('should throw if no configuration is provided', () => {
    expect(() => langtonsant()).to.throw(/configuration/);
  });

  it('should throw if no configuration transformation matrix is provided', () => {
    expect(() => langtonsant({ })).to.throw(/transformationMatrix/);
  });
});
