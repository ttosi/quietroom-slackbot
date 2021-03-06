'use strict'

var sugar = require('sugar'),
    net = require('net'),
	promise = require('promise'),
	_ = require('lodash'),
    log = require('log4js').getLogger();

var Desk = require('./desks.js'),
	User = require('./users.js');

var Server = {
    start: function() {
        net.createServer(function (socket) {
            socket.on('data', function(data) {
                data += ''; // convert the data to string

                var deskId = data.split(':')[0],
                    payload = data.split(':')[1],
                    desk = Desk.get(Desk.all, deskId);

                // respond to a desk when it requests an
                // acknowlegdement via the 'heartbeat' cmd
                if(desk && payload === 'heartbeat') {
                    desk.socket.write('ACK');
                    desk.socket.respondedAt = new Date();
                    return;
                }

                // when a desk doesn't exist, create
                // and register it
                if(!desk) {
                    var properties = payload.split('|');
                    desk = {
                        id: deskId,
                        name: properties[0],
                        location: properties[1]
                    };

                    Desk.all.push(desk);
                }

                // even if the desk exists, the
                // socket should be updated
                desk.socket = socket;
                desk.socket.respondedAt = new Date();
                log.trace(sugar.String.format('desk {0} successfully connected',
                    desk.id
                ));
        	});
        }).listen(1337, function() {
            log.info('server listening for desks on port 1337');
        });

        // start monitoring connected desks
        Server.monitor();
    },

    send: function(alert, receiverId) {
        return new promise(function(resolve, reject) {
			var user = User.get(receiverId);

			if(!user.desk) {
				resolve(
					sugar.String.format("Doesn't look like {0}' is at a desk right now :disappointed:.",
						user.profile.first_name
					)
				);
			}

			user.desk.socket.write(alert);
			resolve(':star::star: They are being hailed! :star::star:');
        });
    },

    monitor: function() {
        setInterval(function() {
            // if the desk hasn't sent a heartbeat request
            // for more than 20 seconds, consider it offline
            // and remove it
            _.forEach(Desk.all, function(d) {
                if(sugar.Date.secondsAgo(d.socket.respondedAt) > 20) {
                    _.remove(Desk.all, function(d) {
                        return sugar.Date.secondsAgo(d.socket.respondedAt) >20;
                    });

                    log.trace(sugar.String.format('desk {0} timed out', d.id));
                }
            });
        }, 30000);
    }
};

module.exports = Server;
