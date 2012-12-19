var Q = require('q'),
	fs = require('fs'),
	readDir = Q.nbind(fs.readdir);

//
// ### function selectFolders (dir)
// #### @dir The file system directory to interrogate.
// Provides the contents of a directory.
//	
exports.selectFolders = function(dir) {
	var deferred = Q.defer();

	readDir(dir)
	.then(function(folders) {
		deferred.resolve(folders);
	})
	.fail(function(err) {
		console.log(err);
		deferred.resolve(['Unknown']);	
	})
	.done();

	return deferred.promise;
};
