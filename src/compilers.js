var jsUserFilePath = '/usercode.js';
var javaUserFilePath = '/src/main/java/Calculator.java';
var rubyUserFilePath = '/my_model.rb';

var jsTestFilePath = '/test.js';
// Find a way to name Java file programatically.
// Could do it based on test file name;
var javaTestFilePath = 'src/test/java/CalculatorTest.java';
var rubyTestFilePath = '/my_model_spec.rb';

module.exports = [
  ['javascript', jsUserFilePath, 'mocha tests.js --reporter json', jsTestFilePath],
  ['java', javaUserFilePath, 'mvn test', javaTestFilePath],
  ['ruby', rubyUserFilePath, 'rspec my_model_spec.rb --format j', rubyTestFilePath]
]
