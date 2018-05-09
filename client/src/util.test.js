const util = require('./util');
test('test distribution', () => {
  expect(util.default.createDistribution([1,1,2,3,4,5], 5)).toEqual([[0,2],[1,1],[2,1],[3,1],[4,1]]);
  expect(util.default.createDistribution([1,1,1,1,1,1], 5)).toEqual([[0,6],[1,0],[2,0],[3,0],[4,0]]);
  expect(util.default.createDistribution([0,0,0,0,0,0], 5)).toEqual([[0,6],[1,0],[2,0],[3,0],[4,0]]);
  expect(util.default.createDistribution([1,1,1,1,1,1], 5)).toEqual([[0,6],[1,0],[2,0],[3,0],[4,0]]);
  expect(util.default.createDistribution([1,1,1,1,1,1], 5, .95)).toEqual([[0,6],[1,0],[2,0],[3,0],[4,0]]);
  expect(util.default.createDistribution([1,1,1,5,5,5], 5)).toEqual([[0,3],[1,0],[2,0],[3,0],[4,3]]);
  expect(util.default.createDistribution([1,1,1,1,1,2], 5, .6)).toEqual([[0,5],[1,0],[2,0],[3,0],[4,0]]);
  expect(util.default.createDistribution([1,2,3,4,5,6], 3, .5)).toEqual([[0,1],[1,1],[2,1]]);
});

