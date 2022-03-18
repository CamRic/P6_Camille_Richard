const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sanitize = require('mongo-sanitize')

const User = require('../models/User')

exports.signup = (req, res, next) => {
    // security
    var sainPassword = sanitize(req.body.password)
    console.log('essai sanitize: ' + sanitize(req.body.email))
    console.log('mdp sain: ' + sainPassword)
    var sainMail = sanitize(req.body.email)
    console.log('email sain: ' + sainMail)
    // hashage du mdp
    bcrypt.hash(sainPassword, 10)
        .then(hash => {
            const newUser = new User({
                email: sainMail,
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
    // security
    var sainPassword = sanitize(req.body.password)
    var sainMail = sanitize(req.body.email)
    // recherche de l'utilisateur correspondant au mail renseigné
    User.findOne({ email: sainMail })
        .then(user => {
            if (!user) { // si entree email non valide
                return res.status(401).json({error: 'Email invalide'})
            }
            // si email valide, verification du mot de passe
            bcrypt.compare(sainPassword, user.password)
                .then(valid => { 
                    if (!valid) { // si mot de passe invalide
                        return res.status(401).json({ error: 'Mot de passe non valide'})
                    }
                    const userToken = jwt.sign(
                        {userId: user._id},
                        'RANDOM_TOKEN_SECRET',
                        {expiresIn: '24h'}
                    )
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