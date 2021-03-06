var jsUserFilePath = '/';
var javaUserFilePath = '/src/main/java/';
var rubyUserFilePath = '/';

module.exports = [
  ['javascript', jsUserFilePath, 'mocha tests.js --reporter json'],
  ['java', javaUserFilePath, 'mvn test > std_out.txt && bash create_json_output.sh'],
  ['ruby', rubyUserFilePath, 'rspec my_model_spec.rb --format j']
]
