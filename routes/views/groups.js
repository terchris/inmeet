var keystone = require('keystone');

var Group = keystone.list('Group');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // locals.section = 'members';

    view.query('groups', Group.model.find().sort('name'), 'usergroups');

    view.render('site/groups');

}
