assert = require('assert');
var fs = require("fs");
//     base_url = "http://localhost:80/";
var contents = fs.readFileSync("analysis-report.json");
var jsonContent = JSON.parse(contents);


describe("Testing Analysis report for Checkbox.io", function() {
  describe("Testing Long Method", function() {
    it("Checking if lines of code < 200", function(done) {
    
       try {
        assert.equal(isEmpty(jsonContent.LongMethod), true );
        done();
	} catch(e) {
    message = "the following methods have failed this test: \n\n\t\t"
    for (var i in jsonContent.LongMethod) {
      message = message + i + "\n\t\t"
    }
	done(message);
 	}

    });
  });
  describe("Testing for Cyclomatic Complexity", function() {
    it("Checking if Cyclomatic Complexity < 15", function(done) {
    
       try {
        assert.equal(isEmpty(jsonContent.CyclomaticComplexity), true );
        done();
	} catch(e) {
    message = "the following methods have failed this test: \n\n\t\t"
    for (var i in jsonContent.CyclomaticComplexity) {
      message = message + i + "\n\t\t"
    }
	done(message);
 	}

    });
  });
  describe("Testing for Max Nesting Depth", function() {
    it("Checking if Max Nesting Depth < 10", function(done) {
    
       try {
        assert.equal(isEmpty(jsonContent.MaxNestingDepth), true );
        done();
	} catch(e) {
    message = "the following methods have failed this test: \n\n\t\t"
    for (var i in jsonContent.MaxNestingDepth) {
      message = message + i + "\n\t\t"
    }
	done(message);
 	}

    });
  });
  describe("Testing for Maximum If Conditions", function() {
    it("Checking if Maximum If Conditions < 10", function(done) {
    
       try {
        assert.equal(isEmpty(jsonContent.MaxIfConditions), true );
        done();
	} catch(e) {
    message = "the following methods have failed this test: \n\n\t\t"
    for (var i in jsonContent.MaxIfConditions) {
      message = message + i + "\n\t\t"
    }
	done(message);
 	}

    });
  });
  describe("Testing for Maximum number of parameters", function() {
    it("Checking if Maximum number of parameters< 10", function(done) {
    
       try {
        assert.equal(isEmpty(jsonContent.Parameters), true );
        done();
	} catch(e) {
    message = "the following methods have failed this test: \n\n\t\t"
    for (var i in jsonContent.Parameters) {
      message = message + i + "\n\t\t"
    }
	done(message);
 	}

    });
  });
});


// describe("Start Stop server.js", function() {
//      describe("Testing", function() {
//        it("testing for server.js file", function(done) {
//  var exec= require('child_process').exec, child;
// exec("var=$(ps -ef | grep node); echo $var",
//     function (error, stdout, stderr) {

// try {
//  assert.equal(stdout.includes("server.js"), true);
//  done();
// } catch(e) {
// done(e);
// }
// //done();
//         if (error !== null) {
//              console.log('exec error: ' + error);
//         }
//     });
//           //done();
//       });

//     });
//   });





// Get Value from JSON
//  console.log("LongMethod:", jsonContent.LongMethod);
//  console.log("CyclomaticComplexity:", jsonContent.CyclomaticComplexity);
//  console.log("MaxNestingDepth:", jsonContent.MaxNestingDepth);
//  console.log("MaxIfConditions",jsonContent.MaxIfConditions);



// try {
//   for (var i in jsonContent) {
//     //assert.equal({}, response.statusCode);
//   }
  
//   done();
// } catch(e) {

// }





function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}
