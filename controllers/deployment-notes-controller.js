var Q = require('q'),
	profileService = require('../services/profile-service'),
	deploymentNoteService = require('../services/deployment-notes-service');

module.exports = function(app) {
	app.get('/', index);
	app.post('/deploy', deploy);
};

//
// ### function index (req, res)
// Presents user with a list of configured deployment profiles 
// of which the user may select, configure, and order to make deployment notes.
//	
var index = function(req, res) {
	profileService.getProfiles()
	.then(function(p) {
		res.render('index', { title: 'Deployment Notes', profiles: p });
	})
	.done();
};

//
// ### function deploy (req, res)
// Handles the user input from index and returns a complete set of deployment notes.
//	
var deploy = function(req, res){
	var data = JSON.parse(req.body.profiles);
	deploymentNoteService.getNotes({'selections' : data})
	.then(function(p) {
		res.render('deploy', { profiles: p });
	})
	.done();
};

