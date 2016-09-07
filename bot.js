'use strict'

require('dotenv').config();

var slackBot = require('slackbots'),
    log = require('log4js').getLogger(),
    sugar = require('sugar');

var Command = require('./commands.js'),
    User = require('./users.js'),
    Server = require('./server.js');

//var users = [];
var botparams = { icon_emoji: process.env.BOT_EMOJI };

var bot = new slackBot({
    token: process.env.SLACKBOT_TOKEN,
    name: process.env.BOT_NAME
});

bot.on('start', function() {
    bot.getUsers()
        .done(function(data) {
            User.list = data.members;
            log.info('total users: ' + User.list.length);
            log.info('active users: ' + sugar.Object.count(User.list, { presence: 'active', is_bot: false }));
            Server.start();
        });

    log.info('initialzed: ' + process.env.BOT_NAME);
    log.info('started on: ' + new Date());
    log.info('token used: ' + process.env.SLACKBOT_TOKEN);
});

bot.on('message', function(data) {
    if(data.type === 'message' && data.subtype !== 'bot_message' ) {
        var cmd = Command.parse(data.text)
        var user = User.get(data.user);

        if(!cmd.command) {
            bot.postMessageToUser(user.name,
                'I\'m sorry, you\'re not making any sense. ' +
                'Asking for `help` might be a good idea.', bot);
            log.error(sugar.String.format('user: {0}, unknown: {1}',
                user.name,
                data.text
            ));
            return;
        }

        cmd.command.execute(user, cmd.param)
            .then(function(response) {
                bot.postMessageToUser(user.name, response, botparams);
                log.info(sugar.String.format('user: {0}, {1}',
                    user.name,
                    data.text
                ));
            })
            .catch(function(err) {
                bot.postMessageToUser(user.name, 'Oops. Something went wrong. I\'ve logged the error and notified my owner.', botparams);
                log.error(sugar.String.format('user: {0}, {1}',
                    user.name,
                    err
                ));
            });
    }
});
