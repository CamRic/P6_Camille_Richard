const jwt = require('jsonwebtoken')
const Sauce = require('../models/Sauce')
const fs = require('fs')
const { request } = require('http')


module.exports = (req, res, next) => {

    try {
        const requestToken = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(requestToken, 'RANDOM_TOKEN_SECRET')
        const requestTokenUserId = decodedToken.userId
        req.auth = { userId: requestTokenUserId }
        if (!req.auth.userId) {
            throw 'invalid token'
        } else {
            next()
        }
    } catch {
        return res.status(401).json({ error: 'unauthorizzed request' })
    }

}