
var keystone = require('keystone');

var Casehome = keystone.list('Case');


exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.section = 'case';

    //console.log('[case] - req.params.case =', req.params.case);
    
    view.on('init', function(next) {

        Casehome.model.findOne()
            .where('key', req.params.case)
            .populate('presenter tags')
            .exec(function(err, casehome) {
                //console.log('[case] - execute');

                if (err) return res.err(err);
                //console.log('[case] - not err');
                if (!casehome) {
                    req.flash('info', 'Sorry, we couldn\'t find the case');
                    return res.redirect('/cases')
                }
                //console.log('[case] - casen has value');
                locals.casehome = casehome;
                //console.log('[case] - locals.case =', locals.casehome);
                
                
                // Create the feedback opbject
               // locals.feedback.text = locals.casehome.feedback;
               // locals.feedback.presenter = locals.casehome.presenter;
               // locals.feedback.presenter.bio = locals.casehome.presenter.bio;
                
                next();


            });

    });



    // Render the view
    view.render('site/casehome');

}
