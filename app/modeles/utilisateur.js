var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');


// Créer le modele mongoose
var UtilisateurSchema = new Schema({
	nom: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

UtilisateurSchema.pre('save', function (next) {
	var utilisateur = this;
	if (this.isModified('password') || this.isNew) {
		bcrypt.genSalt(10, function (err, salt) {
			if (err) {
				return next(err);
			}
			bcrypt.hash(utilisateur.password, salt, function (err, hash) {
				if (err) {
					return next(err);
				}
				utilisateur.password = hash;
				next();
			});
		});
	} else {
		return next();
	}
});

UtilisateurSchema.methods.comparePassword = function (passw, cb) {
	bcrypt.compare(passw, this.password, function (err, isMatch) {
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('Utilisateur', UtilisateurSchema);
