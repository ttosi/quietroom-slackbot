var sugar = require('sugar'),
    promise = require('promise')
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
            execute: command.execute,
            params: params,
        };
    },
    get: function(name) {
        return _.find(Commands.list, function(c) {
            return c.names.indexOf(name) !== -1;
        });
    },
    list: [
        {
            names: ['help', 'h'],
            params: [],
            description: 'Show help',
            execute: function() {
                return new promise(function(resolve, reject) {
                    resolve(Commands.help());
                });
            }
        },
        {
            names: ['list', 'ls'],
            params: [],
            description: 'List desks',
            execute: function() {
                return new promise(function(resolve, reject) {
                    resolve(Desk.list());
                });
            }
        },
        {
            names: ['use', 'u'],
            params: ['deskname'],
            description: 'Assign yourself to a desk',
            execute: function(user, deskname) {
                return new promise(function(resolve, reject) {
                    resolve(Desk.assign(user, deskname));
                });
            }
        },
        {
            names: ['leave', 'l'],
            params: [],
            description: 'Leave your desk',
            execute: function(user) {
                return new promise(function(resolve, reject) {
                    resolve(Desk.leave(user));
                });
            }

        },
        {
            names: ['call', 'c'],
            params: ['@username'],
            description: 'Send low alert',
            execute: function(receiverId) {
                console.log();
                return new promise(function(resolve, reject) {
                    resolve(Server.send('call', receiversId));
                });
            }
        },
        {
            names: ['yell', 'y'],
            params: ['@username'],
            description: 'Send medium alert',
            execute: function(user) {
                return new promise(function(resolve, reject) {
                    Server.send(user.desk, 'yell')
                        .then(function(response) {
                            resolve(response);
                        })
                        .catch(function(err) {
                            console.log(err);
                        });
                });
            }
        },
        {
            names: ['911', 'scream'],
            params: ['@username'],
            description: 'Send critical alert; don\'t cry wolf, okay?',
            execute: function() {
                return new promise(function(resolve, reject) {
                    resolve('My creator hasn\'t taught me how to do that yet.');
                });
            }
        },
        // {
        //     names: ['cancel', 'stop', 'c'],
        //     params: ['@username'],
        //     description: 'Cancel the alert you sent',
        //     execute: function() {
        //         return new promise(function(resolve, reject) {
        //             resolve('My creator hasn\'t taught me how to do that yet.');
        //         });
        //     }
        // },
        // {
        //     names: ['mute', 'ignore', 'm'],
        //     params: ['minutes'],
        //     description: 'Mute all incoming alerts for the minutes specified.',
        //     execute: function() {
        //         return new promise(function(resolve, reject) {
        //             resolve('My creator hasn\'t taught me how to do that yet.');
        //         });
        //     }
        // },
        // {
        //     names: ['boot', 'kick', 'b'],
        //     params: ['deskname'],
        //     description: 'Boot whoever is sitting at the desk specified.',
        //     execute: function() {
        //         return new promise(function(resolve, reject) {
        //             resolve('My creator hasn\'t taught me how to do that yet.');
        //         });
        //     }
        // }
    ]
};

module.exports = Commands;
