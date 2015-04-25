/**
 * Created by tec on 25/04/15.
 * Extending Organisations so that a organisation can be Sponsor, Case on a meetup, Event space for the meetup and so on
 * A modified version of LinkTag.js 
 */
var keystone = require('keystone'),
    Types = keystone.Field.Types;

/**
 * Organisation Tags Model
 * ===============
 */

var OrganisationTag = new keystone.List('OrganisationTag', {
    autokey: { from: 'name', path: 'key', unique: true }
});

OrganisationTag.add({
    name: { type: String, required: true }
});


/**
 * Relationships
 * =============
 */

OrganisationTag.relationship({ ref: 'Organisation', refPath: 'tags', path: 'organisations' });


/**
 * Registration
 * ============
 */

OrganisationTag.register();
