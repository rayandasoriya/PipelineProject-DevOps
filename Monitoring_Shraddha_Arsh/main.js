var http = require('http');
var request = require('request');
var os = require('os');



var exec = require('child_process').exec;

// websocket server that website connects to.
var io = require('socket.io')(3000);
//let date = require('node-datetime');
var dateFormat = require('dateformat');

var startTime = Date.now() ;
var startTimeFormatted =dateFormat(startTime, 'dd/mm/yyyy HH:mm:ss');
//var errorMessage = '';
//var liveliness ='Alive';
/// CHILDREN nodes

var ifaces = os.networkInterfaces();
//console.log(`Trying to get IP address : ${ifaces.address}`);
var nodeServers = 
[
	{url:"http://localhost:8080", latency: 0, name: "client 1", errorMessage: '',liveliness: 'Alive'},
	{url:"http://localhost:4000", latency: 0, name: "client 2", errorMessage: '',liveliness: 'Alive'},
	//{url:"http://localhost:9002", latency: 0}
];

// Launch servers.
/*
exec("node fastService.js");
exec("node mediumService.js");
exec("node slowService.js");
*/
/*
function createProxy(target, port)
{
    // Proxy.
    var options = {};
    var proxy   = httpProxy.createProxyServer(options);

    var server  = http.createServer(function(req, res)
    {
        let delay = (port == 7001) ? 1000 : 0;
		setTimeout(function()
		{
            proxy.web( req, res, {target: target } );
        }, delay);
    });
	var liveliness = server.listen(port);
	
    return `http://localhost:${port}`;
}
*/

function memoryLoad()
{
	// console.log( os.totalmem(), os.freemem() );
	let load = (os.totalmem()-os.freemem())/os.totalmem()*100.0;
	return load.toFixed(2);
}

function cpuTicksAcrossCores()
{
  //Initialise sum of idle and time of cores and fetch CPU info
  var totalIdle = 0, totalTick = 0;
  var cpus = os.cpus();

  //Loop through CPU cores
  for(var i = 0, len = cpus.length; i < len; i++)
  {
                //Select CPU core
                var cpu = cpus[i];
                //Total up the time in the cores tick
                for(type in cpu.times)
                {
                        totalTick += cpu.times[type];
                }
                //Total up the idle time of the core
                totalIdle += cpu.times.idle;
  }

  //Return the average Idle and Tick times
  return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
}

var startMeasure = cpuTicksAcrossCores();


function cpuAverage()
{
	var endMeasure = cpuTicksAcrossCores(); 
 
	//Calculate the difference in idle and total time between the measures
	var idleDifference = endMeasure.idle - startMeasure.idle;
	var totalDifference = endMeasure.total - startMeasure.total;
 
	let busy = totalDifference - idleDifference;
	//Calculate the average percentage CPU usage
	return [(busy/totalDifference*100.0).toFixed(2), (idleDifference/totalDifference *100.0).toFixed(2)];
}

function measureLatenancy(server)
{
	//startTime = Date.now();
	var options = 
	{
		url: server.url
	};
	var currentTime = Date.now();
	var currentTimeFormatted =dateFormat(currentTime, 'dd/mm/yyyy HH:mm:ss');
	
	//console.log("Line 1 ==========================================================");
	
	//console.log(`request to url : ${server.name}`);
	/*console.log("Start time : ",startTimeFormatted);
	console.log("Current Time : ",currentTimeFormatted); */
	request(options, function (error, res, body) 
	{
		
		if(error)
		{
			//console.log(`Server : ${server.url} is not responding !! `);
			server.errorMessage = error;
			server.liveliness = 'Not Alive';
			server.latency = 0;
			//console.log(error);
			//console.log(`liveliness : ${liveliness}`);
		}
		else if(res.statusCode == 200)
		{
			//console.log(`response status : ${res.statusCode}`);
			//console.log(`Server is alive ${server.url}`);
			//console.log(res.statusCode, server.url);
			//console.log("Uptime is : ",process.uptime());
			//server.latency = (Date.now() - startTime);
			//console.log(`${server.name} latency : ${server.latency}`)
			//liveliness = 'Alive';
			//errorMessage = '';
			//console.log(`liveliness : ${liveliness}`);
			server.latency = (Date.now() - startTime);
			//errorMessage = '';
			//liveliness = 'Alive';
		}
		
		//Math.floor(millis/1000)
		//console.log("Start time : ",startTime);
		//console.log(`liveliness : ${liveliness}`);
		//console.log(`error  : ${errorMessage}`);
		//console.log("Line 2==========================================================");
	});
	return [startTimeFormatted, currentTimeFormatted , server.latency, process.uptime(), server.errorMessage, server.liveliness];
}
function calculateColor()
{
        // latency scores of all nodes, mapped to colors.
        var nodes = nodeServers.map( measureLatenancy ).map( function(latency)
        {
                var color = "#cccccc";
                if( !latency )
                        return {color: color};
                if( latency > 1000 )
                {
                        color = "#ff0000";
                }
                else if( latency > 20 )
                {
                        color = "#cc0000";
                }
                else if( latency > 15 )
                {
                        color = "#ffff00";
                }
                else if( latency > 10 )
                {
                        color = "#cccc00";
                }
                else if( latency > 5 )
                {
                        color = "#00cc00";
                }
                else
                {
                        color = "#00ff00";
                }
                console.log( latency );
                return {color: color};
        });
        //console.log( nodes );
        return nodes;
}


io.on('connection', function (socket) {
	console.log("Received connection");

	///////////////
	//// Broadcast heartbeat over websockets
	//////////////
	var heartbeatTimer = setInterval( function () 
	{
		startTime = Date.now();
		for(i=0; i<nodeServers.length; i++)
		{
			//console.log(`liveliness from connection  : ${ measureLatenancy(nodeServers[i])[6]} `);
			var data = { 
				name: nodeServers[i].name, 
				url: nodeServers[i].url,
				cpu: cpuAverage()[0],
				IdleTime: cpuAverage()[1], 
				memoryLoad: memoryLoad(), 
				//name:measureLatenancy(nodeServers[i])[0],
				startTime: measureLatenancy(nodeServers[i])[0],
				currentTime: measureLatenancy(nodeServers[i])[1],
				latency: measureLatenancy(nodeServers[i])[2],
				uptime: measureLatenancy(nodeServers[i])[3],
				errorMessage: measureLatenancy(nodeServers[i])[4],
				liveliness: measureLatenancy(nodeServers[i])[5],
				nodes: calculateColor()
			};
			console.log("interval", data);	
			socket.emit("heartbeat", data);
		}
		
			
		//io.sockets.emit('heartbeat', data );
		
	}, 5000);

	socket.on('disconnect', function () {
		console.log("closing connection")
    	clearInterval(heartbeatTimer);
  	});
});
