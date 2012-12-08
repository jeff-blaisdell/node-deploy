function Profile (id) {
	this.id = id;
	this.params = [];
	
	this.addParam = function(param) {
		this.params.push(param);
	}
}