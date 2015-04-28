var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Organisations Model
 * ===================
 */

var Organisation = new keystone.List('Organisation', {
	track: true,
	autokey: { path: 'key', from: 'name', unique: true }
});

Organisation.add({
		name: {type: String, index: true},
		slogan: {type: String, index: true},
		logo: {type: Types.CloudinaryImage},
		website: Types.Url,
		location: Types.Location,
		description: {type: Types.Markdown},
		adminuser: { type: Types.Relationship, ref: 'User',label: 'Admin user for organisation' }
}, 'Type of Organisation', {
	organisationType: {
		sponsor: { type: Boolean, label: 'Sponsor'},
		venue: { type: Boolean , label: 'Venue'},
		case: { type: Boolean, label: 'Case on a workshop' }
	}
},'Tags', {
	tags: {type: Types.Relationship, ref: 'OrganisationTag', many: true},
},'Other fields', {
	isHiring: Boolean
});


/**
 * Relationships
 * =============
 */

Organisation.relationship({ ref: 'User', refPath: 'organisation', path: 'members' });


/**
 * Registration
 * ============
 */

Organisation.defaultColumns = 'name, website, isHiring';
Organisation.register();
