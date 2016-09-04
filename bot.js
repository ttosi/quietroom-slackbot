'use strict'

require('dotenv').config();

var slackBot = require('slackbots'),
    log = require('log4js').getLogger(),
    sugar = require('sugar');

var Command = require('./commands.js'),
    users = require('./users.js');

var users = [];
var botparams = { icon_emoji: process.env.BOT_EMOJI };

var bot = new slackBot({
    token: process.env.SLACKBOT_TOKEN,
    name: process.env.BOT_NAME
});

bot.on('start', function() {
    bot.getUsers()
        .done(function(data) {
            users = data.members;
            log.trace('total users: ' + users.length);
            log.trace('active users: ' + sugar.Object.count(users, { presence: 'active', is_bot: false }));
        });

    log.trace('initialzed: ' + process.env.BOT_NAME);
    log.trace('started on: ' + new Date());
    log.trace('token used: ' + process.env.SLACKBOT_TOKEN);
});

bot.on('message', function(data) {
    if(data.type === 'message' && data.subtype !== 'bot_message' ) {
        var cmd = Command.parse(data.text)
        var user = users[sugar.Object.find(users, { id: data.user })];

        if(!cmd.command) {
            bot.postMessageToUser(user.name,
                'I\'m sorry, you\'re not making any sense. ' +
                'Asking for `help` might be a good idea.', bot);
            log.error(sugar.String.format('user: {0}, unknown comannd: {1}',
                user.name,
                data.text
            ));
            return;
        }

        cmd.command.execute(user, cmd.param)
            .then(function(response) {
                bot.postMessageToUser(user.name, response, botparams);
                log.info(sugar.String.format('user: {0}, command: {1}',
                    user.name,
                    data.text
                ));
            })
            .catch(function(err) {
                bot.postMessageToUser(user.name, 'Oops. Something went wrong. I\'ve logged the error and notified my owner.', botparams);
                log.error(sugar.String.format('user: {0}, err: {1}',
                    user.name,
                    err
                ));
            });
    }
});
