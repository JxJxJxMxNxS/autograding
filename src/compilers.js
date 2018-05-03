var jsUserFilePath = '/';
var javaUserFilePath = '/src/main/java/';
var rubyUserFilePath = '/';

var jsTestFilePath = '/';
var javaTestFilePath = '/src/test/java/'
var rubyTestFilePath = '/';

module.exports = [
  ['javascript', jsUserFilePath, 'mocha tests.js --reporter json', jsTestFilePath],
  ['java', javaUserFilePath, 'mvn test > std_out.txt && bash create_json_output.sh', javaTestFilePath],
  ['ruby', rubyUserFilePath, 'rspec my_model_spec.rb --format j', rubyTestFilePath]
]
