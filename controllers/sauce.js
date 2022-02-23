
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

// modifier une sauce
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

// bool userid dans tableau like ou dislike
function checkUserLikes(usersArray, userId) {
    let userIn = false
    for (user of usersArray) {
        if (user == userId) userIn = true
    }
    return userIn
}

// suppr userid du tableau
function delUserFromList(array, userid) {
    array.splice(array.indexOf(userid), 1)
}

// like ou dislike d'une sauce 
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (!sauce) {
                return res.status(404).json({ error: 'ressource not found'})
            }
            switch (req.body.like) {
                
                case 0: // annule
                    if (checkUserLikes(sauce.usersLiked, req.body.userId)) {
                        delUserFromList(sauce.usersLiked, req.body.userId)
                        sauce.likes--
                    }
                    if (checkUserLikes(sauce.usersDisliked, req.body.userId)) {
                        delUserFromList(sauce.usersDisliked, req.body.userId)
                        sauce.dislikes--
                    }
                    break

                case -1: // dislike
                    if (checkUserLikes(sauce.usersDisliked, req.body.userId)) { break }
                    if (checkUserLikes(sauce.usersLiked, req.body.userId)) {
                        delUserFromList(sauce.usersLiked, req.body.userId)
                        sauce.likes--
                    }
                    sauce.usersDisliked.push(req.body.userId)
                    sauce.dislikes++
                    break

                case 1: // like
                    if (checkUserLikes(sauce.usersLiked, req.body.userId)) { break }
                    if (checkUserLikes(sauce.usersDisliked, req.body.userId)) {
                        delUserFromList(sauce.usersDisliked, req.body.userId)
                        sauce.dislikes--
                    }
                    sauce.usersLiked.push(req.body.userId)
                    sauce.likes++
                    break

                default:
                    console.log('error invalid request')
                    break
            }
            Sauce.updateOne({ _id: req.params.id }, { $set : { 
                                                            'usersLiked': sauce.usersLiked , 
                                                            'usersDisliked': sauce.usersDisliked , 
                                                            'likes': sauce.likes ,
                                                            'dislikes': sauce.dislikes 
                                                            } })
                .then(() => res.status(200).json({ message: 'like action valide'}))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(404).json({error: 'Sauce introuvable...'}))
}