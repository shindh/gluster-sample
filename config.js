/** Node.js Server Port Setting **/
exports.wsChatServerPort = 5433;
exports.wssChatServerPort = 5434;
exports.wsFileServerPort = 5533;
exports.wssFileServerPort = 5534;


/** SSL Config File Path **/
exports.PrivateKeyPath = 'encrypt/privkey.pem';
exports.CertificatePath = 'encrypt/cert.pem';
exports.RootCAPath = 'encrypt/fullchain.pem';


/** RTDS Setting Info **/
exports.RTDS_ServerIP = '61.252.54.18';
exports.RTDS_ServerPORT = '7777';
exports.RTDS_Connection_Retry_time = 5;
exports.RTDS_Use = false;


/** SIP Proxy Info **/
exports.sipServerIP = '175.193.74.204';
exports.sipPORT = '45060';


/** PT File Directory **/
var webRootDir = '/usr/local/apache-tomcat-7.0.56/webapps/vcs/';
exports.PTdir = webRootDir + 'presentationFiles/';