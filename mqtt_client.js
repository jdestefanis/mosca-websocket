var mqtt = require('mqtt');

exports.publishMsg = async function(device, message, callback) {
    const mqtt_url = "mqtt://localhost";
    var options = {
        port: config.mqttPort,
        clientId : 'xxxxxx'
    };

    var topic = '/light/command';

    var client  = mqtt.connect(mqtt_url, { port: options.port, clientId: options.clientId, protocolId: 'MQIsdp', protocolVersion: 3, connectTimeout:1000, debug:false } );

    client.on('connect', function () {
        client.subscribe(topic);
        client.publish(topic, message); // Here I send the message to the arduino device (which is subscribed to topic)
    });

    client.on('message', (topic, message) => {
        console.log('received message %s %s', topic, message)
        client.end(true);
    });
}
