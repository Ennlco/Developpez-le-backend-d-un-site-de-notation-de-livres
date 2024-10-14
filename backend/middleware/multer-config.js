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
    const filePath = req.file.path;
    sharp(filePath) 
    .resize(200)
    .webp({quality: 85})
    .then((data) =>{
        sharp(data)
        .toFile(filePath)
        .then(() => res.status(200).json({message: 'Image compressé !'}))
        .catch(error => res.status(401).json({error}))
    })
    .catch(error => res.status(400).json({error}))
}

module.exports = multer({storage, resizeImg}).single('image');