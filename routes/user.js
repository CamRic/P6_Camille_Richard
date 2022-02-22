const express = require('express')
const router = express.Router()

const userCtrl = require('../controllers/user')

// création utilisateur
router.post('/signup', userCtrl.signup)

// connexion utilisateur
router.post('/login', userCtrl.login)

module.exports = router