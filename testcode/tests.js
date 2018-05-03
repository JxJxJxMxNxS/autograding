var assert = require('assert');
var sumFunction = require('./usercode.js');

describe('Simple test', function() {
  describe('Sum function', function() {
    it('should equal 5', function() {
      assert.equal(sumFunction(3), 5);
    });
  });
});
