import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Define the destination folder
      cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
      // Define the filename
      cb(null, file.originalname);
    }
  });

export const upload = multer({ storage: multer.memoryStorage() });