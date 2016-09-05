var Sugar = require('sugar'),
    Promise = require('promise');

var Desks = {
    list: function() {
        var desks = [];
        Sugar.Object.forEach(this.all, function(d) {
            var hoursAgo = Math.floor(Sugar.Date.hoursAgo(d.occupied_at) % 24);
            var occupier = Sugar.String.format(
                'has been occupied by {0} for {1}{2}m.',
                d.in_use_by,
                hoursAgo > 0 ? hoursAgo + 'h ' : '',
                Math.floor(Sugar.Date.minutesAgo(d.occupied_at) % 60)
            );

            desks.push(
                Sugar.String.format(
                    '```{0} [{1}] {2}```',
                    d.friendly,
                    d.name,
                    d.in_use_by ? occupier : 'is AVAILABLE!'
                )
            );
        });

        return desks.join('\r\n');
    },
    assign: function(user, deskname) {
        if(user.desk) {
            return 'Ummm, dude. You\'re already using a desk.';
        }

        var desk = Desks.all[Sugar.Object.find(Desks.available(), { name: deskname })];
        if(!desk) {
            return 'That desk doesn\'t exist or someone else is using it.';
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

        user.desk.in_use_by = undefined,
        user.desk.occupied_at = undefined;
        delete user.desk;

        return 'You must now return to the glorious chaos of the office.';
    },
    inuse: function() {
        return Sugar.Object.filter(Desks.all, function(d) {
            return d.in_use_by;
        });
    },
    available: function() {
        return Sugar.Object.filter(Desks.all, function(d) {
            return !d.in_use_by;
        });
    },
    all: [{
       name: 'qd1',
       friendly: 'Quiet Desk 1',
       location: 'Quiet Room',
       in_use_by: undefined,
       occupied_at: undefined
    },
    {
       name: 'qd2',
       friendly: 'Quiet Desk 2',
       location: 'Quiet Room',
       in_use_by: undefined,
       occupied_at: undefined
    }]
};

module.exports = Desks;
