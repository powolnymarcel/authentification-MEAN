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

apiRoutes.post('/login', function(req, res) {
	Utilisateur.findOne({
		nom: req.body.nom
	}, function(err, utilisateur) {
		if (err) throw err;

		if (!utilisateur) {
			res.send({success: false, msg: 'Echec login ,utilisateur non trouvé'});
		} else {
			// check if password matches
			utilisateur.comparePassword(req.body.password, function (err, isMatch) {
				if (isMatch && !err) {
					// if user is found and password is right create a token
					var token = jwt.encode(utilisateur, config.secret);
					// return the information including token as JSON
					res.json({success: true, token: 'JWT ' + token});
				} else {
					res.send({success: false, msg: 'Echec, mauvais password'});
				}
			});
		}
	});
});

// route protegee (GET http://localhost:8080/api/memberinfo)
apiRoutes.get('/info-utilisateur', passport.authenticate('jwt', { session: false}), function(req, res) {
	var token = getToken(req.headers);
	if (token) {
		var decoded = jwt.decode(token, config.secret);
		Utilisateur.findOne({
			name: decoded.name
		}, function(err, utilisateur) {
			if (err) throw err;

			if (!utilisateur) {
				return res.status(403).send({success: false, msg: 'echec login, pas d\'utilisateuur'});
			} else {
				res.json({success: true, msg: 'Beivenue dans votre zone secure ' + utilisateur.nom + '!'});
			}
		});
	} else {
		return res.status(403).send({success: false, msg: 'Pas de token.'});
	}
});

getToken = function (headers) {
	if (headers && headers.authorization) {
		var parted = headers.authorization.split(' ');
		if (parted.length === 2) {
			return parted[1];
		} else {
			return null;
		}
	} else {
		return null;
	}
};

// connect the api routes under /api/*
app.use('/api', apiRoutes);



// Start server
app.listen(port);
console.log('serveur: http://localhost:' + port);
