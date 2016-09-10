'use strict'

var sugar = require('sugar'),
    promise = require('promise'),
    _ = require('lodash');

var User = {
    get: function(id) {
        return _.find(User.list, function (u) {
            return u.id === id || u.name === id;
        });
    },
    init: function() {
    },
    list: []
};

module.exports = User;
