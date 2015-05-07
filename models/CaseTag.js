var keystone = require('keystone'),
    Types = keystone.Field.Types;

/**
 * Case Tags Model
 * ===============
 */

var CaseTag = new keystone.List('CaseTag', {
    autokey: { from: 'name', path: 'key', unique: true }
});

CaseTag.add({
    name: { type: String, required: true }
});


/**
 * Relationships
 * =============
 */

CaseTag.relationship({ ref: 'Case', refPath: 'tags', path: 'tags' });


/**
 * Registration
 * ============
 */

CaseTag.register();

