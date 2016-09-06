var sugar = require('sugar'),
    promise = require('promise');

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
                        '[' + c.params.join(' ') + '] ' :
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
        var param = tokens.join(' ').toLowerCase();
        var command = Commands.list[sugar.Object.find(Commands.list, function(c) {
            return c.names.indexOf(name) !== -1;
        })];

        return {
            command: command,
            param: param
        };
    },
    list: [
        {
            names: ['help'],
            params: [],
            description: 'List available commands.',
            execute: function() {
                return new promise(function(resolve, reject) {
                    resolve(Commands.help());
                });
            }
        },
        {
            names: ['list', 'show', 'who'],
            params: [],
            description: 'List desks and who\'s using it.',
            execute: function() {
                return new promise(function(resolve, reject) {
                    resolve(Desk.list());
                });
            }
        },
        {
            names: ['use', 'take'],
            params: ['deskname'],
            description: 'Assign yourself to a desk.',
            execute: function(user, deskname) {
                return new promise(function(resolve, reject) {
                    resolve(Desk.assign(user, deskname));
                });
            }
        },
        {
            names: ['leave', 'quit', 'exit'],
            params: [],
            description: 'Leave your desk.',
            execute: function(user) {
                return new promise(function(resolve, reject) {
                    resolve(Desk.leave(user));
                });
            }
        },
        {
            names: ['call', 'whisper'],
            params: ['username'],
            description: 'Send low alert.',
            execute: function() {
                return new promise(function(resolve, reject) {
                    resolve('My creator hasn\'t taught me how to do this one yet.');
                });
            }
        },
        {
            names: ['hail'],
            params: ['username'],
            description: 'Send medium alert.',
            execute: function() {
                return new promise(function(resolve, reject) {
                    resolve('My creator hasn\'t taught me how to do this one yet.');
                });
            }
        },
        {
            names: ['yell'],
            params: ['username'],
            description: 'Send high alert.',
            execute: function(user) {
                return new promise(function(resolve, reject) {
                    resolve(Server.send(user.desk, 'yell'));
                });
            }
        },
        {
            names: ['911', 'scream'],
            params: ['username'],
            description: 'Send critical alert. Don\'t cry wolf, okay?',
            execute: function() {
                return new promise(function(resolve, reject) {
                    resolve('My creator hasn\'t taught me how to do this one yet.');
                });
            }
        },
        {
            names: ['wait', 'holdon'],
            params: ['minutes'],
            description: 'Pause alert for minutes speficied. Works only for low and medium alerts.',
            execute: function() {
                return new promise(function(resolve, reject) {
                    resolve('My creator hasn\'t taught me how to do this one yet.');
                });
            }
        },
        {
            names: ['cancel', 'stop'],
            params: [],
            description: 'Cancel your alert and notify the sender (not a wise choice if they\'re screaming).',
            execute: function() {
                return new promise(function(resolve, reject) {
                    resolve('My creator hasn\'t taught me how to do this one yet.');
                });
            }
        },
        {
            names: ['mute', 'ignore', 'seriously?'],
            params: ['minutes'],
            description: 'Mute all incoming alerts for the minutes specified.',
            execute: function() {
                return new promise(function(resolve, reject) {
                    resolve('My creator hasn\'t taught me how to do this one yet.');
                });
            }
        },
        {
            names: ['boot', 'kick'],
            params: ['deskname'],
            description: 'Boot whoever is siiting at that desk.',
            execute: function() {
                return new promise(function(resolve, reject) {
                    resolve('My creator hasn\'t taught me how to do this one yet.');
                });
            }
        }
    ]
};

module.exports = Commands;
