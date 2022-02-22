const express = require('express')
const mongoose = require('mongoose')

const userRoutes = require('./routes/user')

const app = express()

mongoose.connect('mongodb+srv://adminPiiquante:cLCJzzPprIEVzIZ2@piiquante.lkwp4.mongodb.net/OC_P6?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to database'))
    .catch(() => console.log('ERROR: can\'t connect to database'))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})

app.use(express.json())

app.use((req, res, next) => {
    console.log('requete recue')
    next()
})

app.use('/api/auth', userRoutes)

module.exports = app