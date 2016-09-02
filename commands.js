var Sugar = require('sugar'),
    Promise = require('promise');

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
            description:'Lists the people who are currently in the quiet room.',
            action: function() {
                return new Promise(function(resolve, reject) {
                    resolve('list');
                });
            }
        },
        {
            names: ['use', 'take'],
            params: ['desk one|desk two'],
            response: '',
            description:'Assign yourself to a desk in the quiet room.',
            action: function() {
                return new Promise(function(resolve, reject) {
                    resolve('use');
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
            description:'Send a low level alert to a user (this will slowly fade-in/out the light yellow).',
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
            description:'Send a medium level alert to a user (this will pulse the light orange).',
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
            description:'Send a high level alert to a user (this will rapidly flash the light red).',
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
            description:'Send a critical level alert to a user (this will alternate the light blue & red).',
            action: function() {
                return new Promise(function(resolve, reject) {
                    resolve('911');
                });
            }
        },
        {
            names: ['cancel', 'stop'],
            params: [],
            response: '',
            description:'This will cancel your alert and notify the sender.',
            action: function() {
                return new Promise(function(resolve, reject) {
                    resolve('stop');
                });
            }
        }
    ]
};

module.exports = Commands;
