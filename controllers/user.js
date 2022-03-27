const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

exports.signup = (req, res, next) => {
    // hashage du mdp
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const newUser = new User({
                email: req.body.email,
                password: hash
            })
            // enregistre utilisateur dans bdd
            newUser.save()
                .then(() => res.status(201).json({message: 'User Created'}))
                .catch(error => res.status(400).json({ error: 'erreur bad request' }))
        })
        .catch(error => res.status(500).json({ error: "erreur serveur"}))
}

exports.login = (req, res, next) => {
    // recherche de l'utilisateur correspondant au mail renseigné
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) { // si entree email non valide
                return res.status(401).json({error: 'Email invalide'})
            }
            // si email valide, verification du mot de passe
            bcrypt.compare(req.body.password, user.password)
                .then(valid => { 
                    if (!valid) { // si mot de passe invalide
                        return res.status(401).json({ error: 'Mot de passe non valide'})
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            {expiresIn: '24h'}
                        )
                    })
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}