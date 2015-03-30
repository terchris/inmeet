var keystone = require('keystone'),
    Types = keystone.Field.Types;

/**
 * Group Model
 * A user can be member of many groups. The group is used when informing users about meeetups. 
 * This so that not everyone get a email when there is a meetup  
 * =====================
 */

var Group = new keystone.List('Group', {
    track: true,
    autokey: { from: 'name', path: 'key', unique: true }
});

Group.add({
    name: { type: String, required: true },
    country: { type: Types.Select, options: 'Norway, Hungary, Australia, Germany, Poland, Brazil', default: 'Norway', index: true },
    logo: { type: Types.CloudinaryImage },
    description: { type: Types.Markdown },
    city: { type: String, label: 'Type city...' }
});


/**
 * Relationships
 * =============
 */

Group.relationship({ ref: 'User', refPath: 'groups', path: 'usergroups' });
Group.relationship({ ref: 'Meetup', refPath: 'group', path: 'meetupgroup' }); //30Mar15Tec: relation so that it is possible to find meetups by the group

/**
 * Registration
 * ============
 */

Group.register();
