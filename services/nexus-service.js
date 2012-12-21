var config = require ('../config/app-config.json'),
	Q = require('q'),
	http = require('follow-redirects').http,
	xml2js = require('xml2js'),
	xmlParser = new xml2js.Parser({explicitArray : false});


//
// ### function selectArtifacts (opts)
// #### @artifactName The name of the nexus artifact.
// #### @opts Configuration overides
// Looks up all version of parameterized artifact within a Nexus Repo.
//
exports.selectArtifactVersions = function(artifactName, opts) {
	
	// Declare local vars.
	var deferred = Q.defer();
	var html = '';
	opts = opts || {};

	// Setup method parameters.
	var options = {};
	options.hostname = opts.hostname || config.nexus.hostname;
	options.port =     opts.port     || config.nexus.port;
	options.repo =     opts.repo     || config.nexus.repo;
	options.path = config.nexus.path.replace("${artifact}", artifactName);
	
	// Call Nexus Rest API.
	http.request(options, function(res) {
		var doc = '';

		res.on('data', function (chunk) {
			doc += chunk;
		});		

		res.on('end', function() {
			xmlParser.parseString(doc, function(err, data) {
				var artifacts = data['search-results'].data.artifact;
				var versions = [];

				for (var i = 0; i < artifacts.length; i++) {
					var artifact = artifacts[i];
					if (options.repo === artifact.repoId) {
						versions.push(artifact.version);
					}
				}
				deferred.resolve(versions);
			});
		});

	}).on('error', function(e) {
		console.error('problem with request: ' + e.message);
		deferred.resolve(['Unknown']);
	}).end();

	return deferred.promise;
};