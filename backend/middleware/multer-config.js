const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");  


const MIME_TYPES = {
   "image/jpg": "jpg",
   "image/jpeg": "jpg",
   "image/png": "png",
};


const storage = multer.memoryStorage();

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
       fileSize: 4 * 1024 * 1024,
   },
   fileFilter: fileFilter,
}).single("image");


const compressImage = (req, res, next) => {
   if (!req.file) {
       return next();
   }

   
   const name = req.file.originalname.split(" ").join("_");
   const extension = MIME_TYPES[req.file.mimetype] || "jpg";
   const webpFilename = Date.now() + "_" + name.replace(/\.(jpg|jpeg|png)$/, ".webp");

   
   const imagesDir = path.join(__dirname, "../images");


   if (!fs.existsSync(imagesDir)) {
       fs.mkdirSync(imagesDir, { recursive: true });
   }
   const webpFilePath = path.join(imagesDir, webpFilename);

  
   sharp(req.file.buffer)
       .resize({ fit: "cover", height: 250, width: 250 })
       .webp({ quality: 85 })
       .toFile(webpFilePath)
       .then(() => {
         
           req.file.path = webpFilePath;
           req.file.filename = webpFilename;
           next();
       })
       .catch((err) => {
           console.error("Erreur lors de la conversion en WebP :", err);
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