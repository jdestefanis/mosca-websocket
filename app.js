// Import Modules
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
var cookieParser = require('cookie-parser');

const https = require('https');
const fs = require('fs');
const app = express();

var broker = require('./modules/broker.js').getServer();
var websocket = require('./modules/websocket.js').getWsServer();

//// Web Site Section ////
app.set('views', path.join(__dirname, 'views')); //Load View Engine
app.engine('.hbs', exphbs({
  defaultLayout: 'main', 
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}));
// Render View
app.set('view engine', '.hbs');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//MiddleWares
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

// Express Session Middleware
app.set('trust proxy', 1); // trust first proxy
var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
app.use(cookieParser());
const sessionParser = session({
  secret: 'secret', resave: true, cookieName: 'sessionName',
  name: 'sessionId', saveUninitialized: true,
  ephemeral: true, // delete this cookie while browser close
  cookie: { secure: false, expires: expiryDate, 
  maxAge: 24000 * 60 * 60, // One hour
  }
});

app.use(sessionParser);

// //
// // HTTPS Server
// //
  const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
  };

  var httpsServer = https.createServer(options, app, function (req, res) {
  console.log('request starting...https');
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('hello client!');
  res.end();
  });

  httpsServer.listen(3002, function(req, res) {
  console.log('---------------------------------------------')
  console.log('------- Node HTTPS Server Started-------')
  console.log('---------------------------------------------')
  console.log(httpsServer.address())
  var port = httpsServer.address().port
  console.log('Server is running at', httpsServer.address() + ':', port)
  });

  httpsServer.on('upgrade', function(request, socket, head) {
  console.log('http upgrade....');

  sessionParser(request, {}, () => {
    console.log('userId: ' + request.session.userId);
    if (!request.session.userId) {
      socket.destroy();
      return;
    }
    console.log('Session is parsed!');
    
    websocket.handleUpgrade(request, socket, head, function(ws) {
      console.log(head);
      websocket.emit('connection', ws, request);
    });
  });
});

app.get('/', function(req, res, next) {
  res.render('home');
});
