var keystone = require('keystone'),
    async = require('async');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.section = 'cases';
    locals.page.title = 'Cases - ' + keystone.get('brand');
    locals.filters = {
        category: req.params.category
    };
    locals.data = {
        posts: [],
        categories: []
    };

    // Load all categories
    view.on('init', function(next) {

        keystone.list('CaseTag').model.find().sort('name').exec(function(err, results) {

            if (err || !results.length) {
                return next(err);
            }

            locals.data.categories = results;
            console.log('[cases] - tags:', results);
            

            // Load the counts for each category
            async.each(locals.data.categories, function(category, next) {

                keystone.list('Case').model.count().where('tags').in([category.id]).exec(function(err, count) {
                    category.postCount = count;
                    console.log('[cases] - count:', count);
                    console.log('[cases] - category.id:', category.id);
                    next(err);
                });

            }, function(err) {
                next(err);
            });

        });

    });

    // Load the current category filter
    view.on('init', function(next) {

        if (req.params.category) {
            console.log('[cases] - there is a param :', req.params.category);
            keystone.list('CaseTag').model.findOne({ key: locals.filters.category }).exec(function(err, result) {
                locals.data.category = result;
                next(err);
            });
        } else {
            next();
        }

    });

    // Load the posts
    view.on('init', function(next) {

        var q = keystone.list('Case').model.find().sort('-date').populate('presenter tags');

        if (locals.data.category) {
            console.log('[cases] - locals.data.category =', locals.data.category);
            q.where('tags').in([locals.data.category]);
        }

        q.exec(function(err, results) {
            locals.data.posts = results;
            console.log('[cases] - locals.data.posts =', locals.data.posts);
            next(err);
        });

    });

    // Render the view
    view.render('site/cases');

}
