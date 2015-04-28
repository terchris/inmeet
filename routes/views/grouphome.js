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

    locals.section = 'home'; //30Mar15Tec: change to grouphome ?
    locals.meetup = false;
    locals.page.title = 'Innovation Meetups';

    locals.rsvpStatus = {};

    
    //- TODO read the organisers from the database 
    locals.organisers = [
        { name: 'Jerry Kelih', image: 'http://www.gravatar.com/avatar/b27c61fae4c7c45abd2d47871c3fec9d?d=http%3A%2F%2Fsydjs.com%2Fimages%2Favatar.png&r=pg', url: '/member/jerry-kelih'},
        { name: 'Terje Christensen', image: 'http://res.cloudinary.com/businessmodel/image/upload/c_thumb,f_auto,g_faces,h_600,w_600/v1427622621/nyiffok0xhghjbkblgtw.jpg', url: '/member/terje-christensen'},
        { name: 'Gil Davidson',     image: '/images/organiser-gil_davidson.jpg' },
        { name: 'Adam Ahmed',    image: '/images/organiser-adam_ahmed.jpg'     },
        { name: 'Lachlan Hardy', image: '/images/organiser-lachlan_hardy.jpg'  }
    ]

    
    
   //-TODO skeleton for picking the organisers
   // if attendee.isPublic
   //     li: a(href=attendee.url, title=attendee.name.full)
   // img(src=attendee.photo.exists ? attendee._.photo.thumbnail(80,80) : attendee.avatarUrl || '/images/avatar.png', width=40, height=40, alt=attendee.name.full).img-circle
   // else
   // li(title=attendee.name.full): img(src=attendee.photo.exists ? attendee._.photo.thumbnail(80,80) : attendee.avatarUrl || '/images/avatar.png', width=40, height=40, alt=attendee.name.full).img-circle


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
