var http = require('http');
var request = require('request');
var os = require('os');

var exec = require('child_process').exec;

// websocket server that website connects to.
var io = require('socket.io')(3000);
var dateFormat = require('dateformat');

var startTime = Date.now() ;
var startTimeFormatted =dateFormat(startTime, 'dd/mm/yyyy HH:mm:ss');

/// CHILDREN nodes
var nodeServers = 
[
	//{url:"http://localhost:8080", latency: 0, name: "client 1", errorMessage: '',liveliness: 'Alive'},
	{url:"http://a229f5eaf619511e9a3b50a3f6cdbed7-1305493250.us-east-1.elb.amazonaws.com", latency: 0, name: "client 2", errorMessage: '',liveliness: 'Alive'},
];

function memoryLoad()
{
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

var ip=getIPAddress();
console.log("IP Address: ",ip);
function getIPAddress() 
{
	var interfaces = require('os').networkInterfaces();
	for (var devName in interfaces) 
	{
	  var iface = interfaces[devName];
  
	  for (var i = 0; i < iface.length; i++) 
	  {
		var alias = iface[i];
		if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
		{
			return alias.address;
		}
	  }
	}
	return '0.0.0.0';
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
	
	request(options, function (error, res, body) 
	{
		if(error)
		{
			server.errorMessage = error;
			server.liveliness = 'Not Alive';
			server.latency = 0;
		}
		else if(res.statusCode == 200)
		{
			server.latency = (Date.now() - startTime);
		}
	});
	return [startTimeFormatted, currentTimeFormatted , server.latency, os.uptime(), server.errorMessage, server.liveliness];
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
                console.log(latency);
                return {color: color};
        });
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
			var data = { 
				name: nodeServers[i].name, 
				url: nodeServers[i].url,
				ip: getIPAddress(),
				cpu: cpuAverage()[0],
				IdleTime: cpuAverage()[1], 
				memoryLoad: memoryLoad(), 
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
			exec(`curl -i -XPOST 'http://192.168.33.100:8086/write?db=statsdemo' --data-binary 'name,host=serverA value='${data.name}`);
			exec(`curl -i -XPOST 'http://192.168.33.100:8086/write?db=statsdemo' --data-binary 'url,host=serverA value='${data.url}`);
			exec(`curl -i -XPOST 'http://192.168.33.100:8086/write?db=statsdemo' --data-binary 'ip,host=serverA value='${data.ip}`);
			exec(`curl -i -XPOST 'http://192.168.33.100:8086/write?db=statsdemo' --data-binary 'cpu,host=serverA value='${data.cpu}`);
			exec(`curl -i -XPOST 'http://192.168.33.100:8086/write?db=statsdemo' --data-binary 'IdleTime,host=serverA value='${data.IdleTime}`);
			exec(`curl -i -XPOST 'http://192.168.33.100:8086/write?db=statsdemo' --data-binary 'MemoryLoad,host=serverA value='${data.memoryLoad}`);
			exec(`curl -i -XPOST 'http://192.168.33.100:8086/write?db=statsdemo' --data-binary 'latency,host=serverA value='${data.latency}`);
			exec(`curl -i -XPOST 'http://192.168.33.100:8086/write?db=statsdemo' --data-binary 'uptime,host=serverA value='${data.uptime}`);
			exec(`curl -i -XPOST 'http://192.168.33.100:8086/write?db=statsdemo' --data-binary 'errorMessage,host=serverA value='${data.errorMessage}`);
			exec(`curl -i -XPOST 'http://192.168.33.100:8086/write?db=statsdemo' --data-binary 'Liveness,host=serverA value='${data.liveliness}`);
		}
	}, 5000);

	socket.on('disconnect', function () {
		console.log("closing connection")
    	clearInterval(heartbeatTimer);
  	});
});