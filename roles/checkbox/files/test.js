var request = require("request"),
    assert = require('assert'),
    base_url = "http://localhost:80/";

describe("Hello World Server", function() {
  describe("GET /", function() {
    it("returns status code 200", function(done) {
      request.get(base_url, function(error, response, body) {
        //expect(response.statusCode).toBe(200);
        //var result = 3
        //assert.equal(result, 4);
       try {
        assert.equal(200, response.statusCode);
        done();
	} catch(e) {
	done(e);
 	}
      });
    });

  });
});


describe("Start Stop server.js", function() {
     describe("Testing", function() {
       it("testing for server.js file", function(done) {
 var exec= require('child_process').exec, child;
exec("var=$(ps -ef | grep node); echo $var",
    function (error, stdout, stderr) {

try {
 assert.equal(stdout.includes("server.js"), true);
 done();
} catch(e) {
done(e);
}
//done();
        if (error !== null) {
             console.log('exec error: ' + error);
        }
    });
          //done();
      });

    });
  });
