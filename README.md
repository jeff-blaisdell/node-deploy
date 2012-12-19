#Node-DeploymentServices
##Description
A simple web application built on Node.js and Express.js.  The application contains various utilities to aid in the application build and deplopyment processes.

###Project Structure
* wrapper.js

	The wrapper is used to in conjunction with a service / daemon.  It will monitor the web application and restart the node process if necessary.
	It utilizes the Node Forever-Monitor project for this functionality.

* app.js
	
	Primary application (main).  This will configure web application, and initialize controllers.

* controllers

	Each controller contains 1-to-many route mappings, and controller logic for those mappings.

* models
	
	Models.

* services

	Services contain various reusable business logic.  Intended as a nod to the Java / Spring concept of services.

* views

	Jade templtes.  Jade templates contain HTML markup which will be used to render the web pages.

* public

	Browser-side styles and scripts.  These are typically included via a jade template.

* config

	Contains various json properties files used to configure various aspects of the application.


###To run:
* CD to project root directory.
* npm install
* node app.js
* Browse to localhost:8000

###To install as a Windows Service:
* Copy application files to server.
* CD to project root.
* npm install
* npm run-script install-windows-service.

###To uninstall Windows Service:
* CD to project root.
* npm run-script uninstall-windows-service.