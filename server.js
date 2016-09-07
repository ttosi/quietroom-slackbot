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
                if(!desk) {
                    log.error(sugar.String.format('deskId {0} was not found',
                        desk.name
                    ));
                }

                if(payload === 'heartbeat') {
                    desk.socket.write('ACK')
                    log.trace(sugar.String.format('ACK sent to {0}',
                        desk.name
                    ));
                    return;
        		}

                desk.socket = socket;
                log.info(sugar.String.format('desk {0} successfully connected',
                    desk.name
                ));
        	});
        }).listen(1337, function() {
            log.debug('server listening on port 1337');
        });
    },
    send: function(desk, alert) {
        desk.socket.write(alert);
    }
};

module.exports = Server;
