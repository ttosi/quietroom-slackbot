'use strict'

var sugar = require('sugar'),
    promise = require('promise'),
    _ = require('lodash');

var User = {
    get: function(id) {
        return _.find(User.list, { id: id })
    },
    init: function() {

    },
    list: []
};

module.exports = User;
