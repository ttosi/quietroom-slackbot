'use strict'

require('dotenv').config();

var slackBot = require('slackbots'),
    log = require('log4js').getLogger(),
    sugar = require('sugar'),
    _ = require('lodash');

var Command = require('./commands.js'),
    User = require('./users.js'),
    Server = require('./server.js');

var botParams = { icon_emoji: process.env.BOT_EMOJI };

var bot = new slackBot({
    token: process.env.SLACKBOT_TOKEN,
    name: process.env.BOT_NAME
});

bot.on('start', function() {
    bot.getUsers()
        .done(function(data) {
            User.list = data.members;
            Server.start();
        });

    log.info('started: ' + new Date());
    log.info('token: ' + process.env.SLACKBOT_TOKEN);
});

bot.on('message', function(data) {
    if(data.type === 'message' && data.subtype !== 'bot_message' ) {
        var cmd = Command.parse(data.text);
        var user = User.get(data.user);

        if(!cmd.command) {
            bot.postMessageToUser(user.name,
                'I\'m sorry, you\'re not making any sense. ' +
                'Asking for `help` might be a good idea.', botParams);
            log.error(sugar.String.format('{0} => {1}',
                user.name,
                data.text
            ));
            return;
        }

        cmd.command.execute(user, cmd.param)
            .then(function(response) {
                bot.postMessageToUser(user.name, response, botParams);
                log.info(sugar.String.format('{0} => {1}',
                    user.name,
                    data.text
                ));
            })
            .catch(function(err) {
                bot.postMessageToUser(user.name,
                    'Oops. Something went wrong. I\'ve logged the error and notified my owner.', botparams
                );
                log.error(sugar.String.format('{0} => {1}',
                    user.name,
                    err
                ));
            });
    }
});
