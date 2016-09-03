var Sugar = require('sugar'),
    Promise = require('promise');

var Desks = {
    assign: function(desk, user) {
        var desk = Desks.list[Sugar.Object.find(Desks.list, { short: desk })];
        desk.user = user;
        return desk;
    },
    inuse: function() {
        return Sugar.Object.filter(Desks.list, function(d) {
            return d.user !== undefined;
        });
    },
    list: [{
       name: 'quiet-desk-one',
       friendly: 'Quiet Desk One',
       short: 'qd1',
       user: undefined
    },
    {
       name: 'quiet-desk-one',
       friendly: 'Quiet Desk Two',
       short: 'qd2',
       user: undefined
    }]
};

module.exports = Desks;
