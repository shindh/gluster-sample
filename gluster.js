var pkgcloud = require('pkgcloud');
var url = require('url');
var http = require('http');
var ip = require('ip');
var webSocketServer = require('websocket').server;
var webSocketClient = require('websocket').client;

var server = http.createServer(function(request, response) {
});

server.listen(5433, function() {
	console.log('==============================================================');
	console.log('======== This is sample node.js server for Gluster FS ========');
	console.log('==============================================================');
});

var wsServer = new webSocketServer({
	httpServer : server
});

wsServer.on('request', SocketServerOperation);

function SocketServerOperation(request) {
	console.log('==========================================');
	console.log('======== New Connection Connected ========');
	console.log('==========================================');

	var credentials = {};
	var container_name = 'node_container';
	if (process.env.VCAP_SERVICES) { 
		// cloud env. 설정. 데이터 구조는 2.3.4 VCAP_SERVICES 환경정보 참고
		var services = JSON.parse(process.env.VCAP_SERVICES); 
		var glusterfsConfig = services["glusterfs"]; 

		if (glusterfsConfig) { 
			var config = glusterfsConfig[0]; 
			console.log('GlusterFS Services: ' + glusterfsConfig);
			credentials = {
				provider: 'openstack', // 
			    username: config.credentials.username,
			    password: config.credentials.password,
				authUrl:  config.credentials.auth_url.substring(0, config.credentials.auth_url.lastIndexOf('/')),
				region: 'RegionOne' //
			};
		}
	} else {
		// local env.
		credentials = {
			provider: 'openstack',
		    username: 'cf13d551d997458e', 
		    password: 'b45cc01d53a4f0e0',
			authUrl:  'http://54.199.136.22:5000/',
			region: 'RegionOne'
		};
		console.log('local env: ' + credentials);
	}

	var connection = request.accept(null, request.origin);

	connection.on('message', function(msg) {

	});
}