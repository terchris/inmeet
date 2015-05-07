var keystone = require('keystone'),
	moment = require('moment'),
	_ = require('underscore'),
	Types = keystone.Field.Types;

/**
 * Meetups Model
 * =============
 */

var Meetup = new keystone.List('Meetup', {
	track: true,
	autokey: { path: 'key', from: 'name', unique: true }
});

Meetup.add({
	name: {type: String, required: true, initial: true},
	publishedDate: {type: Types.Date, index: true},

	state: {type: Types.Select, options: 'draft, scheduled, active, past', noedit: true},

	startDate: {
		type: Types.Datetime,
		required: true,
		initial: true,
		index: true,
		width: 'short',
		note: 'e.g. 2014-07-15 / 6:00pm'
	},
	endDate: {
		type: Types.Datetime,
		required: true,
		initial: true,
		index: true,
		width: 'short',
		note: 'e.g. 2014-07-15 / 9:00pm'
	},
	description: {type: Types.Html, wysiwyg: true},

	group: {type: Types.Relationship, ref: 'Group'}, //30Mar15Tec: ONE group is hosting the meetup

	place: {
		type: String,
		required: false,
		initial: true,
		width: 'medium',
		default: 'Level 6, 341 George St (Atlassian)',
		note: 'Usually Atlassian – Level 6, 341 George St'
	},
	map: {
		type: String,
		required: false,
		initial: true,
		width: 'medium',
		default: 'Level 6, 341 George St',
		note: 'Level 6, 341 George St'
	},

}, 'Image for event', {
	eventTopImage: {type: Types.CloudinaryImage, label: 'Special image for the event'},
	eventTopImageText: {type: Boolean, default: true, label: 'Display event txt on image'},
}, 'Available and taken seats', {
	maxRSVPs: {type: Number, default: 100},
	totalRSVPs: {type: Number, noedit: true},
}, 'Case for the meetup', {
	case:{
		name: {type: String, required: true, initial: true},
		description: {type: Types.Html, wysiwyg: true},
		organisation: { type: Types.Relationship, ref: 'Organisation' },
		presenter: { type: Types.Relationship, ref: 'User' },
		feedback: {type: Types.Html, wysiwyg: true}
	},	
	legacy: { type: Boolean, noedit: true, collapse: true },
});




// Relationships
// ------------------------------

Meetup.relationship({ ref: 'Talk', refPath: 'meetup', path: 'talks' });
Meetup.relationship({ ref: 'RSVP', refPath: 'meetup', path: 'rsvps' });
Meetup.relationship({ ref: 'Case', refPath: 'meetup', path: 'meetups' });



// Virtuals
// ------------------------------

Meetup.schema.virtual('url').get(function() {
	return '/meetups/' + this.key;
});

Meetup.schema.virtual('remainingRSVPs').get(function() {
	if (!this.maxRSVPs) return -1;
	return Math.max(this.maxRSVPs - (this.totalRSVPs || 0), 0);
});

Meetup.schema.virtual('rsvpsAvailable').get(function() {
	return (this.remainingRSVPs > 0);
});




// Pre Save
// ------------------------------

Meetup.schema.pre('save', function(next) {
	
	var meetup = this;
	
	// If no published date, it's a draft meetup
	if (!meetup.publishedDate) meetup.state = 'draft';
	
	// If meetup date plus one day is after today, it's a past meetup
	else if (moment().isAfter(moment(meetup.startDate).add('day', 1))) meetup.state = 'past';
	
	// If publish date is after today, it's an active meetup
	else if (moment().isAfter(meetup.publishedDate)) meetup.state = 'active';
	
	// If publish date is before today, it's a scheduled meetup
	else if (moment().isBefore(moment(meetup.publishedDate))) meetup.state = 'scheduled';
	
	next();

});




// Methods
// ------------------------------

Meetup.schema.methods.refreshRSVPs = function(callback) {
	
	var meetup = this;
	
	keystone.list('RSVP').model.count()
		.where('meetup').in([meetup.id])
		.where('attending', true)
		.exec(function(err, count) {
			
			if (err) return callback(err);
			
			meetup.totalRSVPs = count;
			meetup.save(callback);
			
		});
	
}

Meetup.schema.methods.notifyAttendees = function(req, res, next) {
	
	var meetup = this;
	
	keystone.list('User').model.find().where('notifications.meetups', true).exec(function(err, attendees) {

		if (err) return next(err);
		
		if (!attendees.length) {
			next();
		} else {
			attendees.forEach(function(attendee) {
				new keystone.Email('new-meetup').send({
					attendee: attendee,
					meetup: meetup,
					subject: 'New meetup: ' + meetup.name,
					to: attendee.email,
					from: {
						name: keystone.get('brand'),
						email: keystone.get('from_email')
					}
				}, next);
			});
		}
		
	});
	
}



Meetup.schema.set('toJSON', {
	transform: function(doc, rtn, options) {
		return _.pick(doc, '_id', 'name', 'startDate', 'endDate', 'place', 'map', 'description', 'rsvpsAvailable', 'remainingRSVPs');
	}
});




/**
 * Registration
 * ============
 */

Meetup.defaultSort = '-startDate';
Meetup.defaultColumns = 'name, state|10%, startDate|15%, publishedDate|15%';
Meetup.register();
