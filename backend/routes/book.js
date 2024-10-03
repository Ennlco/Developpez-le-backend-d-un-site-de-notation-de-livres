const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const resize = require('../middleware/multer-config');

const bookCtrl = require('../controlers/book');

// route pour lire les éléments présent
router.get('/', bookCtrl.readBook);
// route pour voir les 3 éléments les mieux noté
router.get('/bestrating', bookCtrl.bestRating);
// route pour ajouter un élément
router.post('/', auth, multer, bookCtrl.createBook);

// route pour lire un élément séléctionné
router.get('/:id', bookCtrl.selectBook);
// route pour modifier un élément
router.put('/:id', auth, multer, bookCtrl.updateBook);
// route pour supprimer l'élément
router.delete('/:id', auth, bookCtrl.deleteBook);

// route pour noter un élément
router.post('/:id/rating', bookCtrl.ratingBook);
 

module.exports = router;