var Sugar = require('sugar'),
    Promise = require('promise')
    _ = require('lodash');

var Desks = {
    list: function() {
        var desks = [];
        _.forEach(Desks.all, function(d) {
            var status = '';

            if(!d.socket) {
                status = 'OFFLINE';
            } else if(!d.in_use_by) {
                status = 'AVAILABLE';
            } else {
                var hoursAgo = Math.floor(Sugar.Date.hoursAgo(d.occupied_at) % 24);
                var status = Sugar.String.format(
                    'has been occupied by {0} for {1}{2}m.',
                    d.in_use_by,
                    hoursAgo > 0 ? hoursAgo + 'h ' : '',
                    Math.floor(Sugar.Date.minutesAgo(d.occupied_at) % 60)
                );
            }

            desks.push(
                Sugar.String.format(
                    '```{0} [{1}] {2}```',
                    d.name,
                    d.id,
                    status
                )
            );
        });

        return desks.join('\r\n');
    },
    assign: function(user, id) {
        if(user.desk) {
            return 'Ummm, dude, you\'re already using a desk.';
        }

        var desk = Desks.get(Desks.available(), id);
        if(!desk) {
            return 'Fatal error! Well, not really fatal (but it does sound cool). ' +
                   'That desk is either in use, offline or doesn\'t exist.';
        }

        desk.occupied_at = new Date();
        desk.in_use_by = Sugar.String.format('{0} {1}.',
            user.profile.first_name,
            user.profile.last_name.charAt(0)
        );
        user.desk = desk;

        return ':+1: The desk is yours! Go get some work done! ';
    },
    leave: function (user) {
        if(!user.desk) {
            return 'What up yo. You\'re not sitting at a desk in the quiet room.';
        }

        //user.desk.in_use_by = undefined;
        //user.desk.occupied_at = undefined;
        delete user.desk;

        return 'You must now return to the glorious chaos of the office.';
    },
    get: function(desks, id) {
        return _.find(desks, function(d) {
            return d.id === id;
        });
    },
    inuse: function() {
        return _.filter(Desks.all, function(d) {
            return d.in_use_by;
        });
    },
    available: function() {
        return _.filter(Desks.all, function(d) {
            return d.in_use_by !== undefined || d.socket !== undefined;
        });
    },
    all: []
};

module.exports = Desks;
