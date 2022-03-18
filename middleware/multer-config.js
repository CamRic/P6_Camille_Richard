const multer = require('multer')

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },

    filename: (req, file, callback) => {
        const newsauce = JSON.parse(req.body.sauce)
        const extension = MIME_TYPES[file.mimetype]
        const name = newsauce.name.split(' ').join('_')
        callback(null, name + Date.now() + '.' + extension)
    }
})

module.exports = multer({ storage }).single('image')