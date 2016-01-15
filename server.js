var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	= require('passport');
var config      = require('./config/database'); // Recupere le fichier config BDD
var User        = require('./app/modeles/user'); // Recupere le modele mongoose
var port        = process.env.PORT || 8080;
var jwt         = require('jwt-simple');

// recuperer les parametres de REQUEST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Log pour la console
app.use(morgan('dev'));

// Utilisation du package passport dans l'app
app.use(passport.initialize());

//  Route demo(GET http://localhost:8080)
app.get('/', function(req, res) {
	res.send('Hello! http://localhost:' + port + '/api');
});

// Start server
app.listen(port);
console.log('serveur: http://localhost:' + port);
