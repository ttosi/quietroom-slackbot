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

            log.info('started: ' + new Date());
            log.info('token: ' + process.env.SLACKBOT_TOKEN);
            Server.start();
        });
});

bot.on('message', function(message) {
    if(message.type === 'message' && message.subtype !== 'bot_message') {
        var command = Command.parse(message.text);
        var user = User.get(message.user);

        console.log(user.name);
        //console.log(command.params);

        if(!command.execute) {
            bot.postMessageToUser(user.name,
                'I\'m sorry, you\'re not making any sense. ' +
                'Asking for `help` might be a good idea.', botParams
            );
            log.error(sugar.String.format('invalid command: {0} => {1}',
                user.name,
                message.text
            ));
            return;
        }

        command.execute(user, command.params)
            .then(function(response) {
                bot.postMessageToUser(user.name, response, botParams);
                log.info(sugar.String.format('{0} => {1}',
                    user.name,
                    message.text
                ));
            })
            .catch(function(err) {
                bot.postMessageToUser(user.name,
                    'Oops. Something went wrong. I\'ve ' +
                    'logged the error and notified my owner.', botparams
                );
                log.error(sugar.String.format('{0} => {1}',
                    user.name,
                    err
                ));
            });
    }
});
