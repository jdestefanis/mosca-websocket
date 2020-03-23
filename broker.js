var mosca = require('mosca')
var websocket = require('../modules/websocket.js').getWsServer();

var server = null;

var moscaSettings = {
  interfaces: [ { type: "mqtt", port: 1884 }, { type: "http", port: 3000, bundle: true, static: './' }
  ],
};

var Mqttsv = function() {
  server = new mosca.Server(moscaSettings);
  server.on('ready', setup);
  
  var authenticate = function(client, username, password, callback) {
        callback(null, true);
        
  if(authenticate) client.user = username;
  }

  //消息發布後觸發

  server.on('published', function (packet, client) {
    console.log('Topic: ' + packet.topic + 'Payload: ' + packet.payload.toString());
  });
  

  server.on('clientConnected', function(client) {
    console.log(util.getCurrentTime() + ' Client Connected ');
        
  });

  server.on('clientDisconnected' , function(client) {
    console.log(util.getCurrentTime() + ' Client Disconnected');
  });

    console.log('Mosca server is up and running')
}

module.exports = new Mqttsv();

Mqttsv.prototype.getServer = function(){
    return server;
}
