var sugar = require('sugar'),
    net = require('net'),
    log = require('log4js').getLogger();

var Desk = require('./desks.js');

var Server = {
    start: function() {
        net.createServer(function (socket) {
            socket.on('data', function(data) {
        		data += '';
                var deskId = data.split(':')[0];
                var payload = data.split(':')[1];

                var desk = Desk.get(Desk.all, deskId);

                // respond to an existing desk when it requests
                // an acknowlegdement with the heartbeat cmd
                if(desk && payload === 'heartbeat') {
                    desk.socket.write('ACK');
                    desk.socket.respondedAt = new Date();
                    return;
                }

                // when the desk doesn't exist, create a new one
                // from the sent data and register it
                if(!desk) {
                    var properties = payload.split('|');
                    desk = {
                        id: deskId,
                        name: properties[0],
                        location: properties[1]
                    };
                    Desk.all.push(desk);
                }

                // even if the desk exists, the socket needs
                // to be updated
                desk.socket = socket;
                desk.socket.respondedAt = new Date();
                log.info(sugar.String.format('desk {0} successfully connected',
                    desk.id
                ));
        	});
        }).listen(1337, function() {
            log.info('desk server accepting connections on port 1337');
        });

        // start monitoring connected desks
        Server.monitor();
    },
    send: function(desk, alert) {
        desk.socket.write(alert);
    },
    monitor: function() {
        setInterval(function() {
            // if the desk hasn't sent a heartbeat request
            // for more than a minute, consider it offline
            // and remove it from the registered desks
            _.forEach(Desk.all, function(d) {
                if(sugar.Date.secondsAgo(d.socket.respondedAt) > 60) {
                    _.remove(Desk.all, function(d) {
                        return sugar.Date.secondsAgo(d.socket.respondedAt) > 60;
                    });

                    log.error(sugar.String.format('{0} has been disconnected', d.id));
                }
            });
        }, 30000);
    }
};

module.exports = Server;
