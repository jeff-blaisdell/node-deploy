var profiles = require ('../profiles.json');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Deployment Notes', profiles: profiles });
};