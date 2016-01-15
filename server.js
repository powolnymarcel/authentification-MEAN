//Tuto ici
// https://devdactic.com/restful-api-user-authentication-1/


var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	= require('passport');
var config      = require('./config/database'); // Recupere le fichier config BDD
var Utilisateur        = require('./app/modeles/utilisateur'); // Recupere le modele mongoose
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

// connexion a la database
mongoose.connect(config.database);

// pass passport for configuration
require('./config/passport')(passport);

// bundle our routes
var apiRoutes = express.Router();

// create a new user account (POST http://localhost:8080/api/enregistrement)
apiRoutes.post('/enregistrement', function(req, res) {
	if (!req.body.nom || !req.body.password) {
		res.json({success: false, msg: 'Veuillez indiquer un nom et mot de passe'});
	} else {
		var newUtilisateur = new Utilisateur({
			nom: req.body.nom,
			password: req.body.password
		});
		// save the user
		newUtilisateur.save(function(err) {
			if (err) {
				return res.json({success: false, msg: 'Utilisateur deja enregistré.'});
			}
			res.json({success: true, msg: 'Utilisateur crée avec succes.'});
		});
	}
});

// connect the api routes under /api/*
app.use('/api', apiRoutes);



// Start server
app.listen(port);
console.log('serveur: http://localhost:' + port);
