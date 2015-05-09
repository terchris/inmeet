var keystone = require('keystone'),
    Types = keystone.Field.Types;

/**
 * Case Model
 * ===================
 */

    
var Case = new keystone.List('Case', {
    track: true,
    autokey: { from: 'name', path: 'key', unique: true }
});

Case.add({

    name: {type: String, required: true, initial: true},
    description: {type: Types.Html, wysiwyg: true},
    image: { type: Types.CloudinaryImage },
    presenter: { type: Types.Relationship, ref: 'User', index: true },
    meetup: { type: Types.Relationship, ref: 'Meetup', index: true },
    organisation: { type: Types.Relationship, ref: 'Organisation' },
    tags: { type: Types.Relationship, ref: 'CaseTag', many: true },
    feedback: {type: Types.Html, wysiwyg: true},
    date: { type: Types.Date, default: Date.now, index: true }

    
    });





/**
 * Registration
 * ============
 */


Case.register();

