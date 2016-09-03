var Sugar = require('sugar'),
    Promise = require('promise');

var Users = {
    get: function(id) {
        return Users.list[Sugar.Object.find(Users.list, { id: id })];
    },
    init: function() {

    },
    list: []
};

module.exports = Users;
