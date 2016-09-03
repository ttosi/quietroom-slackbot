var Sugar = require('sugar'),
    Promise = require('promise');

var Desks = {
    assign: function(user, deskname) {
        if(Sugar.Object.some(Desks.inuse(), function(d) { return d.user.name === user.name })) {
            return 'Ummm, bro. It\'s Looking like you think you figured out how ' +
                   'to clone yourself. You wish! You\'re actual ' +
                   'self is already using a quiet desk.';
        }

        var desk = Sugar.Object.filter(Desks.available(), { name: deskname });

        if(!desk) {
            return 'That desk doesn\'t exist. Are you sure' +
                   'you know what you\'re doing?';
        }

        desk.user = user;
        return 'The desk is yours! :+1: Now get some work done! ';
    },
    inuse: function() {
        return Sugar.Object.filter(Desks.all, function(d) {
            return d.user !== undefined;
        });
    },
    available: function() {
        return Sugar.Object.filter(Desks.all, function(d) {
            return d.user === undefined;
        });
    },
    all: [{
       name: 'qd1',
       friendly: 'Quiet Desk One',
       user: undefined
    },
    {
       name: 'qd2',
       friendly: 'Quiet Desk Two',
       user: undefined
    }]
};

module.exports = Desks;
