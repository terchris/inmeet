// Load .env for development environments
require('dotenv').load();

// Initialise New Relic if an app name and license key exists
if (process.env.NEW_RELIC_APP_NAME && process.env.NEW_RELIC_LICENSE_KEY) {
	require('newrelic');
}

/**
 * Application Initialisation
 */

var keystone = require('keystone'),
	pkg = require('./package.json');

keystone.init({

	'name': process.env.SITE_NAME || 'Innovation Meetups',
	'brand':  process.env.SITE_BRAND || 'InMeet',
	'from_email' : process.env.SITE_FROM_EMAIL  || 'site_from_email@jalla.com',
	'twitter_id' : process.env.SITE_TWITTER_ID  || 'businessmodel_',
	'inme_about_txt' : process.env.SITE_ABOUT_TXT  || 'We are a community focused on innovation.',
	'inme_home_heading' : process.env.SITE_HOME_HEADING  || 'Want to be more creative and innovate faster? Then you need to join us ',
	'inme_home_txt' : process.env.SITE_HOME_TXT  || 'Join one of the groups in Oslo, Bergen, Stavanger, Trondheim, Krakow, Budapest, Berlin, Rio, Melbourne or start your own',
	'back': '/me',

	'favicon': 'public/favicon.ico',
	'less': 'public',
	'static': 'public',

	'views': 'templates/views',
	'view engine': 'jade',
	'view cache': false,
	
	'emails': 'templates/emails',

	'auto update': true,
	'mongo': process.env.MONGO_URI || 'mongodb://localhost/' + pkg.name,

	'session': true,
	'session store': 'mongo',
	'auth': true,
	'user model': 'User',
	'cookie secret': process.env.COOKIE_SECRET || 'inmeet',
	
	'mandrill api key': process.env.MANDRILL_API_KEY,

	'google api key': process.env.GOOGLE_BROWSER_KEY,
	'google server api key': process.env.GOOGLE_SERVER_KEY,

	'ga property': process.env.GA_PROPERTY,
	'ga domain': process.env.GA_DOMAIN,
	
	'chartbeat property': process.env.CHARTBEAT_PROPERTY,
	'chartbeat domain': process.env.CHARTBEAT_DOMAIN,

	'intercom app id': process.env.INTERCOM_APP_ID,

	'basedir': __dirname
	
});

keystone.import('models');

keystone.set('routes', require('./routes'));

keystone.set('locals', {
	_: require('underscore'),
	moment: require('moment'),
	js: 'javascript:;',
	env: keystone.get('env'),
	utils: keystone.utils,
	plural: keystone.utils.plural,
	editable: keystone.content.editable,
	google_api_key: keystone.get('google api key'),
	ga_property: keystone.get('ga property'),
	ga_domain: keystone.get('ga domain'),
	chartbeat_property: keystone.get('chartbeat property'),
	chartbeat_domain: keystone.get('chartbeat domain'),
	intercom_app_id: keystone.get('intercom app id'),
	name: keystone.get('name'),
	brand: keystone.get('brand'),
	twitter_id: keystone.get('twitter_id'),
	from_email : keystone.get('from_email'),
	inme_about_txt : keystone.get('inme_about_txt'),
	inme_home_heading : keystone.get('inme_home_heading'),
	inme_home_txt : keystone.get('inme_home_txt')
});

keystone.set('email locals', {
	utils: keystone.utils,
	host: (function() {
		if (keystone.get('env') === 'staging') return process.env.SITE_STAGING_URL;
		if (keystone.get('env') === 'production') return process.env.SITE_PRODUCTION_URL;
		return (keystone.get('host') || 'http://localhost:') + (keystone.get('port') || '3000');
	})()
});

keystone.set('nav', {
	'meetups': ['meetups', 'talks', 'rsvps'],
	'members': ['users', 'groups'],
	'posts': ['posts', 'post-categories', 'post-comments'],
	'links': ['links', 'link-tags', 'link-comments'],
	'organisations': ['organisations', 'organisation-tags'],
	'cases': ['cases', 'case-tags']
});

keystone.start();
