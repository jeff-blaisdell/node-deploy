var forever = require('forever-monitor'),
    path = require('path'),
    options = require('./config/wrapper-config.json'),
    script = path.join(__dirname, 'app.js');

var child = new (forever.Monitor)(script, options);

child.on('exit', function () {
	console.log('Deployment Services has exited after 3 restarts');
});

child.start();

