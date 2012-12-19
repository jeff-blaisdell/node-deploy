var Q = require('q'),
	http = require('follow-redirects').http;

//
// ### function scrape (opts)
// #### @domain Root url.  i.e. www.google.com
// #### @path Path relative to root url.
// #### @regex Regular expression used to extract desired information.
// #### @opts Misc. configuration options.
// Requests content from specified page and extracts info with provided regex.
//
exports.scrape = function(domain, path, regex, opts) {

	// Declare local vars.
	var deferred = Q.defer();
	var value = '';
	var html = '';
	opts = opts || {};

	// Setup method parameters.
	regex = new RegExp(regex);
	var options = {};
	options.hostname = domain;
	options.path = path;
	options.port = opts.port || 80;
	if (opts.auth) {
		options.auth = opts.auth;
	}

	// Scrape web page.
	http.request(options, function(res) {
		var doc = '';

		res.on('data', function (chunk) {
			doc += chunk;
		});		

		res.on('end', function() {
			var arr = regex.exec(doc);
			if (arr && arr.length > 0) {
				value = arr[1];
			}
			deferred.resolve(value);
		});

	}).on('error', function(e) {
		console.log('problem with request: ' + e.message);
		deferred.resolve('Unknown');
	}).end();

	return deferred.promise;
}