const jwt = require('jsonwebtoken')
const Sauce = require('../models/Sauce')
const fs = require('fs')
const { request } = require('http')
/*
exports.modifAuth = (req, res, next) => {
    const requestToken = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(requestToken, 'RANDOM_TOKEN_SECRET')
    const requestTokenUserId = decodedToken.userId
}
*/
module.exports = (req, res, next) => {

    try {
        const requestToken = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(requestToken, 'RANDOM_TOKEN_SECRET')
        const requestTokenUserId = decodedToken.userId
        
        req.auth = { userId: requestTokenUserId }
        console.log(req.auth.userId)
        if (!req.auth.userId) {
            throw 'invalid token'
        } else {
            next()
        }
    } catch {
        return res.status(401).json({ error: 'unauthorizzed request' })
    }


/*
    try {
        const requestToken = req.header.authorization.split(' ').join('_')
        const decodedToken = jwt.verify(requestToken, 'RANDOM_TOKEN_SECRET')
        const requestTokenUserId = decodedToken.userId
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (!sauce) {
                    return res.status(404).json({ error })
                }
                if (!sauce.userId == req.params.id) {
                    return res.status(401).json({ error: 'unauthorized request' })
                }
                next()
            })
            .catch(error => res.status(404).json({ error }))
    } catch {
        return res.status(401).json({ error: 'unauthorized request' })
    }
*/




    /* PREMIER ESSAI
    try {
        //console.log(req)
        const requestToken = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(requestToken, 'RANDOM_TOKEN_SECRET')
        console.log('request token userId: ' + decodedToken.userId)
        console.log('request body userId: ' + req.params.userId)
        //console.log('req params:' + req.params.json())
        const requestTokenUserId = decodedToken.userId
        req.auth = { userId: requestTokenUserId }
        console.log('req auth userid: ' + req.auth.userId)
        if (req.params.userId && req.params.userId !== requestTokenUserId) {
            return res.status(401).json({ error })
        }
        next()
    } catch {
        res.status(401).json({
            error: new Error('Unauthorized request')
        })
    }
    */
}