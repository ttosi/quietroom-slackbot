'use strict'

var sugar = require('sugar'),
    promise = require('promise'),
    _ = require('lodash');

var User = {
    get: function(id) {
        console.log(id);
        var user = _.find(User.list, function () {
            return id === id || name === id;
        });
        console.log(user);
        return user;
    },
    init: function() {

    },
    list: []
};

module.exports = User;
