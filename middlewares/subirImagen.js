import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  //destination: function(req,file,cb){ // se se llega a llamar al cb callback significa que se subio correctamente la imagen
  //cb(null, 'uploads/') // lugar donde se guardaran las imagenes
  //},
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

export default upload;
