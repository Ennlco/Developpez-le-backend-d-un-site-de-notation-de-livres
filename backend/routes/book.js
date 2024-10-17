const express = require('express');
const router = express.Router();


const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


const bookCtrl = require('../controlers/book');


// route pour lire les éléments présent
router.get('/', bookCtrl.readBook);
// route pour voir les 3 éléments les mieux noté
router.get('/bestrating', bookCtrl.bestRating);


// route pour ajouter un élément
router.post('/', auth, multer.uploadImage, multer.compressImage, bookCtrl.createBook); 


// route pour lire un élément sélectionné
router.get('/:id', bookCtrl.selectBook);
// route pour modifier un élément
router.put('/:id', auth, multer.uploadImage, multer.compressImage, bookCtrl.updateBook);  
// route pour supprimer l'élément
router.delete('/:id', auth, bookCtrl.deleteBook);


// route pour noter un élément
router.post('/:id/rating', auth, bookCtrl.ratingBook);


module.exports = router;