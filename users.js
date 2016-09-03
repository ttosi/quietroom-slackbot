var Sugar = require('sugar'),
    Promise = require('promise');

var desks = require('./desks.js');

var Users = {
    get: function(id) {
        return Users.list[Sugar.Object.find(Users.list, { id: id })];
    },
    init: function() {

    },
    isassigned: function() {
        return Sugar.Object.some()
    },
    list: []
};

module.exports = Users;
