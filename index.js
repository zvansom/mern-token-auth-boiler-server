require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const expressJWT = require('express-jwt');
const favicon = require('serve-favicon');
const logger = require('morgan');
const path = require('path');

// App instance
const app = express();


// Set up middleware
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false}));

// Helper function:  This allows the server to parse the incoming token from the client.
// This is being run as middleware, so it has access to the request.
function fromRequest(req){
  if(req.body.headers.Authorization &&
    req.body.headers.Authorization.split(' ')[0] === 'Bearer'){
    return req.body.headers.Authorization.split(' ')[1];
  }
  return null;
}

// Controllers
// All auth routes are protected except for POST to /auth/login and POST to /auth/signup
// Remember to pass the JWT_SECRET.
// NOTE: The unless portion is only needed if you need excpetions.
app.use('/auth', expressJWT({
  secret: process.env.JWT_SECRET,
  getToken: fromRequest,
}).unless({
  path: [
    { url: '/auth/login', methods: ['POST'] },
    { url: '/auth/signup', methods: ['POST'] }
  ]
}), require('./controllers/auth'));

// This is the catch-all route.  Ideally you don't get here unless mistakes were made.
app.get('*', function(req, res, next) {
	res.send({ message: 'Not Found', error: 404 });
});

app.listen(process.env.PORT || 3000, () => console.log('Listening on three stacks'));
