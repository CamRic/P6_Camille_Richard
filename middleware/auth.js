const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const requestToken = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(requestToken, 'RANDOM_TOKEN_SECRET')
        const requestTokenUserId = decodedToken.userId
        if (req.body.userId && req.body.userId !== requestTokenUserId) {
            return res.status(401).json({ error })
        }
        next()
    } catch {
        res.status(401).json({
            error: new Error('Unauthorized request')
        })
    }
}