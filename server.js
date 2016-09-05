var net = require('net'),

var Server = {
    start: function() {
        net.createServer(function (socket) {
        	socket.on('data', function(data) {
        		data += '';
        		var params = data.split(':'),
        			deskname = params[0];

        		if(params[1] === 'heartbeat') {
        			if(deskname[deskname]) {
        				socket.write('ACK');
        			}
        		} else {
        			var client = {
        				deskname: deskname,
        				socket: socket
        			};

        			clients[client.username] = client;
        			writeLog('{0} connected'.format(client.username));
        		}
        	});
        }).listen(1337, function() {
        	console.log('tcp server running');
        });
    },
    alerts: {
    	call: 0xF0,
    	hail: 0xF1,
    	yell: 0xF2,
    	scream: 0xF3
};

module.exports = Server;
