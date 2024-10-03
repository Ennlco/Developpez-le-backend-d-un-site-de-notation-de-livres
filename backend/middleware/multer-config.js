const multer = require('multer');
const sharp = require('sharp');

const MINE_TYPES ={
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
}

const storage = multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null, 'images')
    },
    filename: (req, file, callback) =>{
        const name = file.originalname.split(' ').join('_');
        const extention = MINE_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extention);
    }
});

const resizeImg = (req, res, next) =>{
    sharp(storage.filename) 
    .resize(500)
    .toBuffer()
    .then(() => res.status(200).json({message: 'image redimentionné !'}))
    .catch(error => res.status(401).json({error}));
    next();
};

module.exports = multer({storage, resizeImg}).single('image');