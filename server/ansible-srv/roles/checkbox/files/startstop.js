var exec= require('child_process').exec, child; 

function start() {


child = exec("pm2 list; pm2 start server.js; mocha",
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        //console.log('stderr: ' + stderr);
        if (error !== null) {
             console.log('exec error: ' + error);
        }
    });
//await sleep(1000);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
 console.log("Starting");
 await start();
 console.log("Sleeping");
 await sleep (30000);
 console.log("Stopping");
 await stop();
})();


function stop () {
child = exec("pm2 delete all; mocha; pm2 list",
    function (error, stdout, stderr) {
       console.log('stdout: ' + stdout);
       //console.log('stderr: ' + stderr);
        if (error !== null) {
             console.log('exec error: ' + error);
        }
    });


}
