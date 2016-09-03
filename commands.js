var Sugar = require('sugar'),
    Promise = require('promise'),
    desks = require('./desks.js');

var Commands = {
    help: function() {
        var commands = [];
        Sugar.Object.forEach(this.list, function(c) {
            commands.push(
                Sugar.String.format('```{0} {1} - {2}```',
                     c.names.join('|'),
                     c.params.length > 0 ?
                        '[' + c.params.join(' ') + ']' :
                        '',
                     c.description
                )
            );
        });
        return commands.join('\r\n');
    },
    validate: function(cmd) {
    },
    list: [
        {
            names: ['help'],
            params: [],
            response: '',
            description:'Shows this list of commands.',
            action: function() {
                return new Promise(function(resolve, reject) {
                    resolve(Commands.help());
                });
            }
        },
        {
            names: ['list', 'show', 'who'],
            params: [],
            response: '',
            description:'Lists all of the desks and, if it\'s in use, the person who\'s using it.',
            action: function() {
                return new Promise(function(resolve, reject) {
                    resolve('list');
                });
            }
        },
        {
            names: ['use', 'take'],
            params: ['deskname'],
            response: '',
            description:'Assign yourself to a desk in the quiet room. Use "list" to see available desks.',
            action: function(user, deskname) {
                return new Promise(function(resolve, reject) {
                    resolve(desks.assign(user, deskname));
                });
            }
        },
        {
            names: ['leave', 'quit', 'exit'],
            params: [],
            response: '',
            description:'Leave your quiet room desk.',
            action: function() {
                return new Promise(function(resolve, reject) {
                    resolve('leave');
                });
            }
        },
        {
            names: ['call', 'whisper'],
            params: ['username'],
            response: '',
            description:'Send a low alert (slowly fade the light in & out in yellow).',
            action: function() {
                return new Promise(function(resolve, reject) {
                    resolve('call');
                });
            }
        },
        {
            names: ['hail'],
            params: ['username'],
            response: '',
            description:'Send a medium alert (pulses the light in orange).',
            action: function() {
                return new Promise(function(resolve, reject) {
                    resolve('hail');
                });
            }
        },
        {
            names: ['yell'],
            params: ['username'],
            response: '',
            description:'Send a high alert (rapidly flashes the light in red).',
            action: function() {
                return new Promise(function(resolve, reject) {
                    resolve('yell');
                });
            }
        },
        {
            names: ['911', 'scream'],
            params: ['username'],
            response: '',
            description:'Send a critical alert (alternates the light in blue & red).',
            action: function() {
                return new Promise(function(resolve, reject) {
                    resolve('911');
                });
            }
        },
        {
            names: ['wait', 'holdon', 'seriously?'],
            params: ['minutes'],
            response: '',
            description:'This will pause the alert for the number of minutes speficied. It can only be used for low and medium alerts.',
            action: function() {
                return new Promise(function(resolve, reject) {
                    resolve('stop');
                });
            }
        },
        {
            names: ['cancel', 'stop'],
            params: [],
            response: '',
            description:'This will cancel your alert and notify the sender (probably not a wise choice if they\'re screaming).',
            action: function() {
                return new Promise(function(resolve, reject) {
                    resolve('stop');
                });
            }
        },
        {
            names: ['boot', 'kick'],
            params: ['deskname'],
            response: '',
            description:'This will boot whomever is siiting at that desk. The person at the desk will have 2 minutes to respond before they\'re booted, unless, of course it\'s a ghostbot (they\'re real you know).',
            action: function() {
                return new Promise(function(resolve, reject) {
                    resolve('stop');
                });
            }
        }
    ]
};

module.exports = Commands;
