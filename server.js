var sugar = require('sugar'),
    net = require('net'),
    log = require('log4js').getLogger();

var Desk = require('./desks.js');

var Server = {
    start: function() {
        net.createServer(function (socket) {
            socket.on('data', function(data) {
                data += ''; // convert the data to char
                var deskId = data.split(':')[0],
                    payload = data.split(':')[1];

                var desk = Desk.get(Desk.all, deskId);

                // respond to a desk when it requests an
                // acknowlegdement via a 'heartbeat' cmd
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

                // even if the desk exists, the socket should
                // to be updated
                desk.socket = socket;
                desk.socket.respondedAt = new Date();
                log.info(sugar.String.format('desk {0} successfully connected',
                    desk.id
                ));
        	});
        }).listen(1337, function() {
            log.info('server listening for desks on port 1337');
        });

        // start monitoring connected desks
        Server.monitor();
    },
    send: function(receiversId, alert) {
        return new promise(function(resolve, reject) {
            console.log('---------------->' + receiversId);
            resolve('fail!')
        });
        //desk.socket.write(alert);
    },
    monitor: function() {
        setInterval(function() {
            // if the desk hasn't sent a heartbeat request
            // for more than 20 seconds, consider it offline
            // and remove it from the registered desks
            _.forEach(Desk.all, function(d) {
                if(sugar.Date.secondsAgo(d.socket.respondedAt) > 20) {
                    _.remove(Desk.all, function(d) {
                        return sugar.Date.secondsAgo(d.socket.respondedAt) >20;
                    });

                    log.info(sugar.String.format('desk {0} timed out', d.id));
                }
            });
        }, 30000);
    }
};

module.exports = Server;
