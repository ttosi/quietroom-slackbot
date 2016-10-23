'use strict'

var sugar = require('sugar'),
    promise = require('promise'),
    _ = require('lodash');

var User = {
    get: function(id) {
		// when a user is sent as @user slack sends it
		// in the format: <@userid>. If that's the case,
		// parse out the id
		if(id.startsWith('<@')) {
			id = /<@(.+)>/.exec(id)[1].toUpperCase();
		}

        return _.find(User.list, function (u) {
            return u.id === id || u.name === id;
        });
    },
    init: function() {
    },

    list: []
};

module.exports = User;
