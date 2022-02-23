const express = require('express')
const router = express.Router()

const sauceCtrl = require('../controllers/sauce')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

// recevoir toutes les sauces
router.get('/', sauceCtrl.getAllSauces)

// recevoir une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce)

// creer une sauce
router.post('/', auth, multer, sauceCtrl.createSauce)

// supprimer une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce)

// modifier une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce)

// aimer une sauce
router.post('/:id/like', auth, sauceCtrl.likeSauce)

module.exports = router