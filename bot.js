'use strict'

require('dotenv').config();

var SlackBot = require('slackbots'),
    Log = require('log4js').getLogger(),
    Sugar = require('sugar');

var commands = require('./commands.js'),
    users = require('./users.js'),
    desks = require('./desks.js');

var users = [];
var botparams = { icon_emoji: process.env.BOT_EMOJI };

var bot = new SlackBot({
    token: process.env.SLACKBOT_TOKEN,
    name: process.env.BOT_NAME
});

bot.on('start', function() {
    bot.getUsers()
        .done(function(data) {
            users = data.members;
            Log.trace('users: ' + users.length);
        });

    Log.trace('bot initialzed: ' + process.env.BOT_NAME);
    Log.trace('token: ' + process.env.SLACKBOT_TOKEN);
    Log.trace('started at: ' + new Date());
});

bot.on('message', function(data) {
    if(data.type === 'message' && data.subtype !== 'bot_message' ) {
        var tokens = data.text.split(' ');
        var commandname = tokens.shift().toLowerCase();
        var commandparam = tokens.join(' ').toLowerCase();

        var command = commands.list[Sugar.Object.find(commands.list, function(c) {
            return c.names.indexOf(commandname) !== -1;
        })];

        var user = users[Sugar.Object.find(users, { id: data.user })];

        if(!command) {
            bot.postMessageToUser(user.name, 'I\'m sorry, you\'re not making any sense. Asking for `help` might be a good idea.', botparams);
            Log.error(Sugar.String.format('user: {0}, unknown comannd: {1}',
                user.name,
                data.text
            ));
            return;
        }

        command.execute(user, commandparam)
            .then(function(response) {
                bot.postMessageToUser(user.name, response, botparams);
                Log.info(Sugar.String.format('user: {0}, command: {1}',
                    user.name,
                    data.text
                ));
            })
            .catch(function(err) {
                bot.postMessageToUser(user.name, 'Oops. Something went wrong. I\'ve logged the error and notified my owner.', botparams);
                Log.error(Sugar.String.format('user: {0}, err: {1}',
                    user.name,
                    err
                ));
            });
    }
});
