var profiles = require ('../profiles.json');

exports.create = function(req, res){
	var data = JSON.parse(req.body.profiles);
	var p = [];
	if (data) {
		p = mergeData(profiles, data);
	}
	res.render('deploy', { profiles: p });
};

var mergeData = function(profiles, data) {
	var r = [];
	console.log(data);
	for (var i=0; i < data.length; i++) {
		var p = findProfile(profiles, data[i]);
		console.log([data[i], p]);
		if (p && data[i].params) {
			for (var c=0; c < data[i].params.length; c++) {
				var param = mergeParam(p.params, data[i].params[c])
				if (param) {
					param.value = data[i].params[c].value;
				}
			}
			r.push(p);
		}
	}
	return r;
}

var findProfile = function(profiles, profile) {
	if (profiles && profile) {
		for (var i=0; i < profiles.length; i++) {
			if (profiles[i].id === profile.id) {
				return profiles[i];
			}
		}
	}
};

var mergeParam = function(params, param) {
	if (params && param) {
		for (var i=0; i < params.length; i++) {
			if (params[i].name === param.name) {
				params[i].value = param.value;
				break;
			}
		}
	}
};