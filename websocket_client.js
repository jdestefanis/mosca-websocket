//WebSockets
$(document).ready(function() {
  let ws;
    
  if (ws) { ws.onerror = ws.onopen = ws.onclose = null; ws.close(); }

  ws = new WebSocket(`wss://${location.host}`);
  ws.onerror = function() { console.log('WebSocket error'); };
  ws.onopen = function() { console.log('WebSocket connection established'); };
  ws.onclose = function() { console.log('WebSocket connection closed'); ws = null; };

  ws.onmessage = function (message) {
    try {
      var json = JSON.parse(message.data);
    } catch (e) {
      console.log('Invalid JSON: ', message.data);
      return;
    }        
  };

  if (!ws) { Console.log('No WebSocket connection'); return; }
  ws.send("{'command':'turnon'}");
});
