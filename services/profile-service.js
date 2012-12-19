var config = require('../config/profiles.json'),
	Q = require('q'),
	fileService = require('./file-service'),
    nexusService = require('./nexus-service');

//
// ### function getProfiles ()
// Prepares and returns a list of deployment profiles.
//	
exports.getProfiles = function() {
	var deferred = Q.defer();

	var promises = config.map(makeProfile);

	Q.all(promises)
	.then(function(promises) {
		deferred.resolve(promises);
	})
	.done(); 

	return deferred.promise;
};

var makeProfile = function(profile) {
	var deferred = Q.defer();

	var params    = profile.deploy.params.map(makeParam);
	var rollbacks = profile.rollback.map(makeRollback);	
	var promises  = params.concat(rollbacks);

	Q.all(promises)
	.then(function() {
		deferred.resolve(profile);	
	})
	.done();

	return deferred.promise;
};

var makeParam = function(param) {
	var deferred = Q.defer();

	if (param.type === "DIRECTORY") {
		fileService.selectFolders(param.src)
		.then(function(folders) {
			param.options = folders;
			deferred.resolve(param);
		})
		.done();
	} else if (param.type === "NEXUS_ARTIFACT") {
		nexusService.selectArtifactVersions(param.artifact)
		.then(function(versions) {
			param.options = versions;
			deferred.resolve(param);
		})
		.done();
	} else {
		deferred.resolve(param);
	}

	return deferred.promise;	
};

var makeRollback = function(rollback) {
	var deferred = Q.defer();

	if (rollback.type === "ROLLBACK_VERSION") {
		fileService.selectFolders(rollback.src)
		.then(function(folders) {
			rollback.options = folders;
			deferred.resolve(rollback);
		})
		.done();
	} else if (rollback.type === "ROLLBACK_NEXUS_VERSION") {
		nexusService.selectArtifactVersions(rollback.artifact)
		.then(function(versions) {
			rollback.options = versions;
			deferred.resolve(rollback);
		})
		.done();
	} else {
		deferred.resolve(rollback);
	}

	return deferred.promise;
};