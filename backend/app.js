const express = require('express');
const mongoose = require('mongoose');


const path = require('path');


const bookRoute = require('./routes/book');
const userRoute = require('./routes/user');


const app = express();


// connexion à MongoDB
mongoose.connect('mongodb+srv://Ennlco:ugytvNwMLG0zJRGW@ennlco.vyiqv.mongodb.net/?retryWrites=true&w=majority&appName=Ennlco',
   { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log('Connexion à MongoDB réussi !'))
   .catch(() => console.log('Connexion à MongoDB échoué !'));


// Autoriser toutes les requêtes
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
});


// Création de l'application via express
app.use(express.json());


// Utilisation des routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/books', bookRoute);
app.use('/api/auth', userRoute);


module.exports = app;