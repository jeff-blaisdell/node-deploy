var config = require('../config/profiles.json'),
	Q = require('q'),
	htmlService = require('../services/html-service');

//
// ### function getNotes (opts)
// #### @opts Various options used to create deployment notes.
// #### @opts.selections User input.  Used to match against deployment profiles.
// Merges user input into configured deployment profiles to produce a complete set of deployment notes.
//	
exports.getNotes = function(opts) {
	var deferred = Q.defer();

	process.nextTick(function() {
		opts = opts || {};
		var selections = opts.selections.map(function(selection) {
			return makeProfile(config, selection, opts);
		});

		Q.all(selections)
		.then(function(profiles) {
			return deferred.resolve(profiles);
		})
		.done(); 
	});

	return deferred.promise;
};

var makeProfile = function(profiles, selection, opts) {
	var deferred = Q.defer();

	process.nextTick(function() {

		var profile = findProfile(profiles, selection);
		makeParams(profile, selection.params);
		var validations = profile.validate.map(function(validate) {
			return makeValidation(validate, opts);
		});
		var rollbacks = profile.rollback.map(makeRollback);		
		var promises = rollbacks.concat(validations);

		Q.all(promises)
		.then(function() {
			deferred.resolve(profile);
		})
		.done();
	});

	return deferred.promise;
};

var makeValidation = function(validation, opts) {
	var deferred = Q.defer();

	process.nextTick(function() {
		if (validation.type === 'SITE_TEST') {
			deferred.resolve(validation);
		} else if (validation.type === 'SVN_REVISION') {
			var domain = validation.svn.domain.replace(/\$\{stgenv\}/, opts.stgenv);
			htmlService.scrape(domain, validation.svn.version, validation.svn.versionRegex)
			.then(function(svn) {
				validation.value = svn;
				deferred.resolve(validation);
			})
			.done();
		} else {
			deferred.resolve(validation);
		}
	});

	return deferred.promise;
};

var makeRollback = function(rollback) {
	var deferred = Q.defer();

	process.nextTick(function() {
		if (rollback.type === "ROLLBACK_SVN_REVISION") {
			htmlService.scrape(rollback.svn.domain, rollback.svn.version, rollback.svn.versionRegex)
			.then(function(svn) {
				rollback.value = svn;
				deferred.resolve(rollback);
			})
			.done();
		} else {
			deferred.resolve(rollback);
		}
	});

	return deferred.promise;
};

var makeParams = function(profile, params) {
	if (profile && params) {
		for (var c=0; c < params.length; c++) {
			var param = findParam(profile.deploy.params, params[c]);
			if (!param) {
				param = findParam(profile.rollback, params[c]);
			}

			if (param) {
				param.value = params[c].value;
			}
		}
	}	
};

var findProfile = function(profiles, profile) {
	if (profiles && profile) {
		for (var i=0; i < profiles.length; i++) {
			if (profiles[i].id === profile.id) {
				return profiles[i];
			}
		}
	}
};

var findParam = function(params, param) {
	if (params && param) {
		for (var i=0; i < params.length; i++) {
			if (params[i].name === param.name) {
				return params[i];
			}
		}
	}
};