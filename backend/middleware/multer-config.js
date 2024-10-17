const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");  
const MIME_TYPES = {
   "image/jpg": "jpg",
   "image/jpeg": "jpg",
   "image/png": "png",
};
const storage = multer.diskStorage({
   destination: (req, file, callback) => {
       callback(null, "images");
   },
   filename: (req, file, callback) => {
       const name = file.originalname.split(" ").join("_");
       const extension = MIME_TYPES[file.mimetype] || "jpg";  
       callback(null, Date.now() + "_" + name + "." + extension);  
   },
});

// Filtrer les fichiers acceptÃ©s
const fileFilter = (req, file, callback) => {
   const isValid = MIME_TYPES[file.mimetype];
   if (isValid) {
       callback(null, true);
   } else {
       callback(new Error("Type de fichier non pris en charge."), false);
   }
};
const upload = multer({
   storage: storage,
   limits: {
       fileSize: 4 * 1024 * 1024, // Limitation image, inferieur a 4mo
   },
   fileFilter: fileFilter,
}).single("image");

// Redimensionne et convertit l'image en WebP
const compressImage = (req, res, next) => {
   if (!req.file) {
       return next();
   }
   const filePath = req.file.path;
   const webpFilePath = filePath.replace(/\.(jpg|jpeg|png)$/, ".webp");
   sharp(filePath)
       .resize({ fit: "cover", height: 250, width: 250 })
       .webp({ quality: 85 })  
       .toFile(webpFilePath)  
       .then(() => {
           // Supprimer  image orignal
           fs.unlink(filePath, (err) => {
               if (err) {
                   console.error("Erreur lors de la suppression de l'image originale:", err);
                   return next(err);
               }
    
               req.file.path = webpFilePath;
               req.file.filename = req.file.filename.replace(/\.(jpg|jpeg|png)$/, ".webp");
               next();
           });
       })
       .catch((err) => {
           next(err);
       });
};
const uploadImage = (req, res, next) => {
   upload(req, res, function (err) {
       if (err) {
           if (err.code === "LIMIT_FILE_SIZE") {
               return res.status(400).json({
                   message: "La taille du fichier est trop importante (4 Mo maximum).",
               });
           } else if (err.message === "Type de fichier non pris en charge.") {
               return res.status(400).json({ message: err.message });
           } else {
               return res.status(400).json({ message: err.message });
           }
       }
       next();
   });
};

module.exports = {
   uploadImage,
   compressImage,
};