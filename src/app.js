var buildResJSON = require('./utils/buildResJSON.js');
var compilersArr = require('./compilers.js');
var path = require('path');

var express = require('express');
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var fs = require('fs');
var ncp = require('ncp');
var rimraf = require('rimraf');

var multer = require('multer');
var storage = multer.memoryStorage();

var upload = multer({ storage: storage });

var app = express();
var port = 3000;

// app.use(express.static(__dirname));
app.use(bodyParser());

/*
  Interface1: unit tests file received as file
  req.files -> Object where,
    req.files['fieldname'][0] -> File
  req.body.langid -> string
*/

app.post('/compile', upload.fields([{
  name: 'codefile', maxCount: 1 }, {
  name: 'testfile', maxCount: 1
}]), function(req, res) {
  var langId = parseInt(req.body.langid);
  var identifier = Math.floor(Math.random() * 1000000);

  var langFolder = compilersArr[langId][0];
  var dirToCopy = path.join(__dirname, './usercode/' + langFolder);
  var dest = path.join(__dirname, './code_to_compile/' + identifier);


  // Create temp directory
  fs.mkdirSync(dest);

  // Copy contents to temp directory
  ncp(dirToCopy, dest, function(err) {
    if(err) {
      throw Error(err);
    }

    var codeFile = req.files['codefile'][0];
    var codeFileName = codeFile.originalname;
    var filePath = compilersArr[langId][1];

    var testFile = req.files['testfile'][0];
    var testFileName = testFile.originalname;
    var testFilePath = compilersArr[langId][3];

    // Write codefile to temp dir
    fs.writeFileSync(path.join(dest, filePath + codeFileName), codeFile.buffer);
    // Write testfile to temp dir
    fs.writeFileSync(path.join(dest, testFilePath + testFileName), testFile.buffer);

    // Get compiling command
    var compCommand = compilersArr[langId][2];
    // Build statement to be executed
    var compSt = 'cd ' + dest + ' && ' + compCommand;

    exec(compSt, function(err, stdOut, stdErr) {
      // Remove temp dir
      rimraf.sync(dest);

      if(err) {
        throw Error(err);
      } else if(stdErr) {
        console.log('stdErr: ' + stdErr);
        // What would be a more appropriate http status?
        return res.send(200).json({
          error: stdErr
        });
      } else {
        console.log('stdOut: ' + stdOut);
        var parsedOutput = JSON.parse(stdOut);
        var resJSON = buildResJSON(parsedOutput, langId);
        res.status(200).json(resJSON);
      }
    });
  });
});

app.listen(port, function() {
  console.log("Listening on port " + port);
});
