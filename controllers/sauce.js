
const fs = require('fs')

const Sauce = require('../models/Sauce')

// récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
}

// récupérer une sauce avec id
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            console.log(req.params.id)
            res.status(200).json(sauce)
        })
        .catch(error => res.status(404).json({ error }))
}

// créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    })
    sauce.save()
        .then(() => res.status(201).json({message: 'Nouvelle sauce créée!'}))
        .catch(error => res.status(404).json({ error }))
}

// supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (!sauce) {
                return res.status(404).json({ error: 'ressource introuvable'})
            }
            if (sauce.userId !== req.auth.userId) {
                return res.status(401).json({ error: 'unauthorized request'})
            }
            Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimée!'}))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(404).json({error}))
}

/*
// modifier une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body } // ?
    console.log('sauce object: ' + sauceObject)
    console.log('object usr id: ' + sauceObject.userId)
    console.log('req auth userid: ' + req.auth.userId)
    if (sauceObject.userId !== req.auth.userId) {
        return res.status(401).json({error: 'unauthorized request'})
    }
    Sauce.updateOne({ _id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({message: "Sauce modifiée!"}))
        .catch(error => res.status(400).json({ error }))
}
*/


exports.modifySauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if (!sauce) {
                return res.status(404).json({ error: 'ressource not found'})
            }
            if (sauce.userId !== req.auth.userId) {
                return res.status(401).json({error: 'Unauthorized rrequest'})
            }
            const sauceObject = req.file ?
            {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : { ...req.body }
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
                .catch(error => res.status(400).json({ error: 'echec modification sauce...' }))
        })
        .catch(error => res.status(404).json({error: 'Sauce introuvable...'}))
}

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (!sauce) {
                return res.status(404).json({ error: 'ressource not found'})
            }
            var sauceObj = new Sauce({
                ...sauce
            })
            switch (req.body.like) {
                case 0: // annule
                    if (req.body.userId in sauce.usersLiked) {
                        sauce.usersLiked.unshift(req.body.userId)
                        sauce.likes = sauce.likes - 1
                    }
                    if (req.body.userId in sauce.usersUnliked) {
                        sauce.usersUnLiked.unshift(req.body.userId)
                        sauce.unlikes = sauce.unlikes - 1
                    }                
                    break
                case -1: // dislike
                    if (req.body.userId in sauce.usersUnliked) {
                        break
                    }
                    if (req.body.userId in sauce.usersLiked) {
                        sauce.usersLiked.unshift(req.body.userId)
                        sauce.likes = sauce.likes - 1
                    }
                    sauce.usersUnliked.push(req.body.userId)
                    sauce.unlikes = sauce.unlikes + 1
                    break
                case 1: // like
                    if (req.body.userId in sauce.usersLiked) {
                        break
                    }
                    if (req.body.userId in sauce.usersUnliked) {
                        sauce.usersUnLiked.unshift(req.body.userId)
                        sauce.unlikes = sauce.unlikes - 1
                    }
                    sauce.likes = sauce.likes + 1
                    sauce.usersLiked.push(req.body.userId)
                    break
                default:
                    console.log('error invalid request')
                    break
            }
            console.log(sauce)
            console.log('sending modif to db')
            Sauce.updateOne({ _id: req.params.id }, { $set : { 'usersLiked': sauce.usersLiked , 
                                                            'userUnliked': sauce.userUnliked , 
                                                            'likes': sauce.likes,
                                                            'unlikes': sauce.unlikes } })
                .then(() => res.status(200).json({ message: 'like action valide'}))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(404).json({error: 'Sauce introuvable...'}))
}