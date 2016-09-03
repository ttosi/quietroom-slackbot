var Sugar = require('sugar'),
    Promise = require('promise');

var Desks = {
    list: function() {
        var desks = [];
        Sugar.Object.forEach(this.all, function(d) {
            desks.push(
                Sugar.String.format('```{0} ({1}) {2}```',
                    d.friendly,
                    d.name,
                    d.in_use_by ? 'is occupied by ' + d.in_use_by : 'is AVAILABLE!'
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

        user.desk = desk;
        desk.in_use_by = Sugar.String.format('{0} {1}.',
            user.profile.first_name,
            user.profile.last_name.charAt(0)
        );

        return 'The desk is yours! :+1: Go get some work done! ';
    },
    leave: function (user) {
        user.desk.in_use_by = undefined,
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
       friendly: 'Quiet Desk One',
       location: 'Quiet Room',
       in_use_by: undefined,
    },
    {
       name: 'qd2',
       friendly: 'Quiet Desk Two',
       location: 'Quiet Room',
       in_use_by: undefined,
    }]
};

module.exports = Desks;
