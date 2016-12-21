var pkgcloud = require('pkgcloud');
var url = require('url');
var http = require('http');
var ip = require('ip');
var webSocketServer = require('websocket').server;
var webSocketClient = require('websocket').client;

var credentials = {};
var container_name = 'node_container';
if (process.env.VCAP_SERVICES) { 
	// cloud env. �꽕�젙. �뜲�씠�꽣 援ъ“�뒗 2.3.4 VCAP_SERVICES �솚寃쎌젙蹂� 李멸퀬
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

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '5434');

var webSocketServer = require('websocket').server;

var server = http.createServer(function(request, response) {
	console.log('==============================================================');
	console.log('======== This is sample node.js server for Gluster FS ========');
	console.log('==============================================================');
});

server.listen(port);

var wsServer = new webSocketServer({
	httpServer : server
});

wsServer.on('request', SocketServerOperation);

function SocketServerOperation(request) {
	console.log('==========================================');
	console.log('======== New Connection Connected ========');
	console.log('==========================================');

	var connection = request.accept(null, request.origin);
	
	connection.on('message', function(msg) {

	});
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
