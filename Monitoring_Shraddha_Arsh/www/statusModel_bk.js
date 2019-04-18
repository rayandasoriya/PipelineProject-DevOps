var StatusModel = function(clients) {
    var self = this;
    self.clients = ko.observableArray();

    self.addClient = function(client) {
        self.clients.push(
            new ClientModel(client)
        );
    };
 
    self.removeClient = function(client) {
        self.clients.remove(client);
    };
 
    self.updateClient = function(person) 
    {
        for(var i = 0 ; i < self.clients().length ; i++)
        {
            var koObj = self.clients()[i];
            //console.log( koObj.name() )
            if(self.clients()[i].name() === person.name)
            {
                koObj.cpu(person.cpu);
                koObj.memoryLoad(person.memoryLoad);
                koObj.IdleTime(person.IdleTime);
                koObj.startTime(person.startTime);
                koObj.endTime(person.endTime);
                koObj.latency(person.latency);
                koObj.uptime(person.uptime);
                koObj.errorMessage(person.errorMessage);
                koObj.liveliness(person.liveliness);

                koObj.nodes([]);
                for( var j = 0; j < person.nodes.length ; j++ )
                {
                    koObj.nodes.push( new NodeModel(person.nodes[j]) );
                }
                break;
            }
        }
    };

    // initialize first time.
    for( var i = 0; i < clients.length; i++)
    {
        self.addClient( clients[i] );
    }
};

var ClientModel = function(client)
{
    var self = this;
    self.cpu = ko.observable(client.cpu);
    self.memoryLoad = ko.observable(client.memoryLoad);
    self.name = ko.observable(client.name);
    self.nodes = ko.observableArray([]);
    self.IdleTime = ko.observable(client.IdleTime);
    self.startTime = ko.observable(client.startTime);
    self.endTime = ko.observable(client.endTime);
    self.latency = ko.observable(client.latency);
    self.uptime = ko.observable(client.uptime);
    self.errorMessage = ko.observable(client.errorMessage);
    self.liveliness = ko.observable(liveliness);

    // init
    for( var i = 0; i < client.nodes.length; i++ )
    {
        self.nodes.push( new NodeModel(client.nodes[i]) );
    }
}

var NodeModel = function(node) {
    var self = this;
    self.color = ko.observable(node.color);
};

 
var viewModel = new StatusModel(
[
    { 
        name: "Fake Client", cpu: "39.95", memoryLoad: "40", IdleTime: "0:0:0", startTime:Date.now(), 
        endTime: Date.now(), latency: "5", uptime: "50.0", errorMessage: " ", liveliness: "Alive",
        nodes: 
        [
            {color:"#00ff00"},
            {color:"#cccc00"},
            {color:"#cccc00"}
        ]
    },
    { 
        name: "Your Computer", cpu: "0.00", memoryLoad: "0",IdleTime: "0:0:0", startTime:Date.now(), 
        endTime: Date.now(), latency: "0.0", uptime: "50.0", errorMessage: " ", liveliness: "Alive",
        nodes: 
        [
            {color:"#ab3fdd"},
            {color:"#ab3fdd"},
            {color:"#ab3fdd"}
        ]
    }
]);


$(document).ready( function()
{
    ko.applyBindings(viewModel);
    $('#statusTable').DataTable( { "paging":   false, "info":     false });

    var socket = io.connect('http://localhost:3000');
    console.log(socket);

    socket.on("heartbeat", function(client) 
    {
        console.log(JSON.stringify(client));
        viewModel.updateClient( 
        {
            name:client.name, 
            cpu:client.cpu, 
            memoryLoad: client.memoryLoad,
            nodes:client.nodes, 
            IdleTime:client.IdleTime,
            startTime:client.startTime,
            endTime:client.endTime,
            latency:client.latency,
            uptime:client.uptime,
            errorMessage:client.errorMessage,
            liveliness:liveliness
        });
    });
}); 
