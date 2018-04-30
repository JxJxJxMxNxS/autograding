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

app.post('/compile', upload.single('codefile'), function(req, res) {
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

    var fileName = req.file.originalname;
    var filePath = compilersArr[langId][1];
    // Write codefile to temp dir
    fs.writeFileSync(path.join(dest, filePath + fileName), req.file.buffer);

    // Get compiling command
    var compCommand = compilersArr[langId][2];
    // Build statement to be executed
    var compSt = 'cd ' + dest + ' && ' + compCommand;

    exec(compSt, function(err, stdOut, stdErr) {
      // Remove temp dir
      rimraf.sync(dest);

      if(err) {
        console.log(err);
      } else if(stdErr) {
        console.log('stdErr: ' + stdErr);
        // What would be a more appropriate http status?
        return res.send(200).json({
          error: stdErr
        });
      } else {
        console.log('stdOut: ' + stdOut);
        var parsedOutput = JSON.parse(stdOut);
        res.status(200).json(parsedOutput);
      }
    });
  });
});

app.listen(port, function() {
  console.log("Listening on port " + port);
});
