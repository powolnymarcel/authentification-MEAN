//What this config does?
//	This code adds the JwtStrategy to our passport, and later you will se how to assign this specific strategy to a route.
//	For now, this just defines how PassportJS tries to find a user with a given jwt_payload.id.
//
var JwtStrategy = require('passport-jwt').Strategy;

// Chargement du modele Utilisateur
var Utilisateur = require('../app/modeles/utilisateur');
var config = require('../config/database'); // get db config file

module.exports = function(passport) {
	var opts = {};
	opts.secretOrKey = config.secret;
	passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
		Utilisateur.findOne({id: jwt_payload.id}, function(err, user) {
			if (err) {
				return done(err, false);
			}
			if (user) {
				done(null, user);
			} else {
				done(null, false);
			}
		});
	}));
};
