'use strict'

var Sugar = require('sugar'),
    Promise = require('promise'),
    _ = require('lodash');

var Desks = {
    list: function() {
        var desks = [];

        _.forEach(Desks.all, function(d) {
            var status = '';

            if (!d.socket) {
                status = 'OFFLINE';
            } else if (!d.in_use_by) {
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

            // TODO need to add location
            desks.push(
                Sugar.String.format(
                    '```{0} ({1}) {2}```',
                    d.name,
                    d.id,
                    status
                )
            );
        });

        if (desks.length === 0) {
            return "There are currently no registered quiet desks :thinking_face:.";
        }

        return desks.join('\r\n');
    },

    assign: function(user, id) {
        if (user.desk) {
            return "Ummm, dude, you're already using a desk :smirk:.";
        }

        var desk = Desks.get(Desks.available(), id);

        if (!desk) {
            return 'Fatal error :boom:! Well, not really, but I always ' +
                'thought it sounded cool. ' +
                "That desk is either in use, offline, or doesn't exist.";
        }

        desk.occupied_at = new Date();
        desk.in_use_by = Sugar.String.format('{0} {1}.',
            user.profile.first_name,
            user.profile.last_name.charAt(0)
        );
        user.desk = desk;

        return 'The desk is yours :+1:';
    },

    leave: function(user) {
        if (!user.desk) {
            return "What up yo, you haven't `use`d a desk yet :open_mouth:.";
        }

        user.desk.in_use_by = undefined;
        user.desk.occupied_at = undefined;
        delete user.desk;

        return 'You must now return to the glorious chaos of the office :scream:.';
    },

    get: function(desks, id) {
        return _.find(desks, function(d) {
            return d.id.toLowerCase() === id.toLowerCase();
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
