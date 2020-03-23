const WebSocket = require('ws');
const MqttClient = require('mqtt_client');
const map = new Map();

var wss = null;

var WebSocketServer = function() {
    wss = new WebSocket.Server({ clientTracking: false, noServer: true });

    wss.on('connection', async function(ws, request) {
        console.log('wss client connected!');
        const userId = request.session.userId;
        map.set(userId, ws);
    
        ws.on('message', async function(message) {
          console.log(`Received message ${message} from user ${userId}`);
          // Now send an answer to the frontend
          ws.send(`mensaje recibido:  ${message} fromuser ${userId}`);
          
          // Here I subscribe to MQTT to send a message to the Client (Arduino)
          await MqttClient.publishMsg(device, event);
        });
        
        ws.on('close', function() {
          console.log('wss closeee....');
          map.delete(userId);
        });
    });
    
    function sleep(ms) {
        return new Promise((resolve) => {
        setTimeout(resolve, ms);
        });
    }   
}

module.exports = new WebSocketServer();

WebSocketServer.prototype.getWsServer = function(){
    return wss;
}
