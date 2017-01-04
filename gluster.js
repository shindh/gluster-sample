var pkgcloud = require('pkgcloud');
var url = require('url');
var http = require('http');
var ip = require('ip');
var webSocketServer = require('websocket').server;
var webSocketClient = require('websocket').client;
var formidable = require('formidable');
var fs = require('fs');

/**
 * Read gluster fs data from system env value
 */
var credentials = {};
var container_name = 'node_container';
if (process.env.VCAP_SERVICES) { 
	var services = JSON.parse(process.env.VCAP_SERVICES); 
	var glusterfsConfig = services["glusterfs"]; 

	if (glusterfsConfig) { 
		var config = glusterfsConfig[0]; 
		credentials = {
			provider: config.credentials.provider,
		    username: config.credentials.username,
		    password: config.credentials.password,
			authUrl:  config.credentials.auth_url.substring(0, config.credentials.auth_url.lastIndexOf('/')),
			region: 'RegionOne'
		};
		console.log('provider: ' + credentials.provider);
		console.log('username: ' + credentials.username);
		console.log('password: ' + credentials.password);
		console.log('authUrl: ' + credentials.authUrl);
		console.log('region: ' + credentials.region);
	}
} else {
	console.log('Can not find glusterfs service instance !!!');
	// local env.
	credentials = {
		provider: 'openstack',
	    username: 'cf13d551d997458e', 
	    password: 'b45cc01d53a4f0e0',
		authUrl:  'http://54.199.136.22:5000/',
		region: 'RegionOne'
	};
	console.log('local env: ' + credentials.username);
}

/**
 * create Client & Container
 */
var client = pkgcloud.storage.createClient(credentials);
client.getContainer(container_name, function(err, container){
    if (err)
    {
    	console.log('getContainer result ERR');
		// if container not exist
        if (err.statusCode === 404)
        {
      		// create container
            client.createContainer({name:container_name}, function(create_err, create_container){
                if (create_err) console.log(err);
        		else
        		{  
			        var serviceUrl = url.parse(create_container.client._serviceUrl);
			        var option = {
			            host: serviceUrl.hostname,
			            port: serviceUrl.port,
			            path: serviceUrl.path + '/' + container_name,
			            method: 'POST',
			            headers: {
			              'X-Auth-Token': create_container.client._identity.token.id,
			              'X-Container-Read': '.r:*' // ACL form
			            }
			        };
			        var req = http.request(option, function(res){
			        	console.log('create container result: ' + res.toString());
			        });
			        req.end();
        		}

            });
        }
        else    
        	console.log(err);
    }
    else{
    	console.log('Successfully create container');
    }
});

function uploadImg(cb){
	console.log('UploadImg called..');
	var readStream = fs.createReadStream('./image/sample.png');
	console.log('Setting glusterFS..');
	var writeStream = client.upload({
		container: container_name,
		contentType: 'png',
		remote: 'm2soft/sample.png',
	});

	writeStream.on('error', function(err) {
		console.log('On writeStream ERR');
		cb(err, '');
	});

	writeStream.on('success', function(file) {
		console.log('On writeSteam SUCCESS');
		cb('', file);
	});

	console.log('Start uploading image to cloud');
	readStream.pipe(writeStream);
}

function upload(result){
	console.log('Upload called..');
	uploadImg(function(err, file){
		if(err) {
			result('Upload failed..');
		} else {
			var filePath = file.client._serviceUrl + '/' + file.container + '/' + file.name;
			if (err){
				// res.status(400).json({err:err});
				console.log("ERR: " + err);
			}else{
				// res.status(200).json({thumb_img_path:filePath});
				console.log('File PATH: ' + filePath);
			}
			result('Upload successfully');
		}
	});
}

/**
 * Get port from environment and store in Express.node
 */
var port = normalizePort(process.env.PORT || '5434');

var webSocketServer = require('websocket').server;

var server = http.createServer(function(request, response) {
	console.log('==========================================');
	console.log('||     This is sample node.js server    ||');
	console.log('||          for Gluster FS              ||');
	console.log('==========================================');
});

server.listen(port);

var wsServer = new webSocketServer({
	httpServer : server
});

wsServer.on('request', SocketServerOperation);

function SocketServerOperation(request) {
	console.log('==========================================');
	console.log('||     New Connection Connected         ||');
	console.log('==========================================');
	console.log('provider: ' + credentials.provider);
	console.log('username: ' + credentials.username);
	console.log('password: ' + credentials.password);
	console.log('authUrl: ' + credentials.authUrl);
	console.log('region: ' + credentials.region);
	console.log('')
	console.log('==========================================');
	console.log('||     Start uploading image file       ||');
	console.log('||     img url: ./image/sample.png      ||');
	console.log('==========================================');
	console.log('')
	connectToGlusterFS(function(){
		upload(function(result){
			console.log('result: ' + result);
		});
	});
	

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
