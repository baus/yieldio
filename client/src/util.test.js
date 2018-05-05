const util = require('./util');
test('test distribution', () => {
  expect(util.default.createDistribution([1,2,3,4,5], 5, false, x=>x)).toEqual([[0,1],[1,1],[2,1],[3,1],[4,1]]);
});

