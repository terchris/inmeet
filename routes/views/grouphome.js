/**
 * Created by tec on 30/03/15.
 */
// This is the homepage for a group. It works just as the original sydJS homepage


var keystone = require('keystone'),
    moment = require('moment');

var Meetup = keystone.list('Meetup'),
    Post = keystone.list('Post'),
    RSVP = keystone.list('RSVP');
    Group = keystone.list('Group'); //30Mar15Tec: fetch the group as well

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    locals.section = 'home'; //Tec: change to grouphome ?
    locals.meetup = false;
    locals.page.title = 'Welcome to SydJS';

    locals.rsvpStatus = {};


    // First find the Group


    view.on('init', function(next) {
        Group.model.findOne()
            .where('key', req.params.group)
            .exec(function(err, group) {
                if (err) return res.err(err);
                if (!group) {
                    req.flash('info', 'Sorry, we couldn\'t find a matching group -' + req.params.group + '-');
                    return res.redirect('/groups')
                }
                locals.group = group;
                next();
            });
    });
    
    


    // Load the first, NEXT meetup

    view.on('init', function(next) {
        Meetup.model.findOne()
            .where('state', 'active')
            .where('group', locals.group._id)
            .sort('-startDate')
            .exec(function(err, activeMeetup) {
                locals.activeMeetup = activeMeetup;
                next();
            });

    });


    // Load the first, PAST meetup

    view.on('init', function(next) {
        Meetup.model.findOne()
            .where('state', 'past')
            .where('group', locals.group._id)
            .sort('-startDate')
            .exec(function(err, pastMeetup) {
                locals.pastMeetup = pastMeetup;
                next();
            });

    });


    // Load an RSVP

    view.on('init', function(next) {

        if (!req.user || !locals.activeMeetup) return next();

        RSVP.model.findOne()
            .where('who', req.user._id)
            .where('meetup', locals.activeMeetup)
            .exec(function(err, rsvp) {
                locals.rsvpStatus = {
                    rsvped: rsvp ? true : false,
                    attending: rsvp && rsvp.attending ? true : false
                }
                return next();
            });

    });


    // Decide which to render

    view.on('render', function(next) {

        locals.meetup = locals.activeMeetup || locals.pastMeetup;
        if (locals.meetup) {
            locals.meetup.populateRelated('talks[who] rsvps[who]', next);
        } else {
            next();
        }

    });

    view.render('site/grouphome');

}
