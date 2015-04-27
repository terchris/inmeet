/**
 * Created by tec on 27/04/15.
 * Extending Organisations so that a organisation can be Startup, Consulting company, or whatever tag is needed. 
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
