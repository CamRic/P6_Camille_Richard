const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const mongoSanitize = require('express-mongo-sanitize')

const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauce')

const app = express()

mongoose.connect('mongodb+srv://adminPiiquante:cLCJzzPprIEVzIZ2@piiquante.lkwp4.mongodb.net/OC_P6?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to database'))
    .catch(error => handleError(error))

app.use(express.json())
app.use(mongoSanitize())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/auth', userRoutes)
app.use('/api/sauces', sauceRoutes)

module.exports = app