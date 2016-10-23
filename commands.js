'use strict'

var sugar = require('sugar'),
    promise = require('promise'),
	_ = require('lodash');

var Desk = require('./desks.js'),
    Server = require('./server.js');

var Commands = {
    help: function() {
        var commands = [];

        sugar.Object.forEach(this.list, function(c) {
            commands.push(
                sugar.String.format('```{0} {1}- {2}```',
                    c.names.join('|'),
                    c.params.length > 0 ?
                    c.params.join(' ') + ' ' :
                    '',
                    c.description
                )
            );
        });

        return commands.join('\r\n');
    },
    parse: function(cmdText) {
        var tokens = cmdText.split(' ');
        var name = tokens.shift().toLowerCase();
        var params = tokens.join(' ').toLowerCase();

        var command = Commands.get(name);

        return {
            execute: command ? command.execute : undefined,
            params: params,
        };
    },
    get: function(name) {
        return _.find(Commands.list, function(c) {
            return c.names.indexOf(name) !== -1;
        });
    },
    list: [{
        names: ['help'],
        params: [],
        description: 'Show help',
        execute: function() {
            return new promise(function(resolve, reject) {
                resolve(Commands.help());
            });
        }
    }, {
        names: ['list'],
        params: [],
        description: 'List desks',
        execute: function() {
            return new promise(function(resolve, reject) {
                resolve(Desk.list());
            });
        }
    }, {
        names: ['use'],
        params: ['deskname'],
        description: 'Assign yourself to a desk',
        execute: function(user, deskname) {
            return new promise(function(resolve, reject) {
                resolve(Desk.assign(user, deskname));
            });
        }
    }, {
        names: ['leave'],
        params: [],
        description: 'Leave your desk',
        execute: function(user) {
            return new promise(function(resolve, reject) {
                resolve(Desk.leave(user));
            });
        }

    }, {
        names: ['call'],
        params: ['@username'],
        description: 'Send low alert',
        execute: function(user, receiverId) {
            return new promise(function(resolve, reject) {
                Server.send('call', receiverId)
                    .then(function(response) {
                        resolve(response);
                    });
            });
        }
    }, {
        names: ['yell'],
        params: ['@username'],
        description: 'Send medium alert',
        execute: function(user, receiverId) {
			return new promise(function(resolve, reject) {
                Server.send('yell', receiverId)
                    .then(function(response) {
                        resolve(response);
                    });
            });
        }
    }, {
        names: ['911'],
        params: ['@username'],
        description: 'Send critical alert; don\'t cry wolf, okay?',
        execute: function(user, receiverId) {
			return new promise(function(resolve, reject) {
                Server.send('call', receiverId)
                    .then(function(response) {
                        resolve(response);
                    });
            });
        }
    }]
};

module.exports = Commands;
