const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
const AppError = require('../utils/AppError');
const { HTTP_STATUS } = require('../constants');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}).fields([
  { name: 'idFront', maxCount: 1 },
  { name: 'idBack', maxCount: 1 },
  { name: 'selfie', maxCount: 1 }
]);

const uploadFields = (req, res, next) => {
  multerUpload(req, res, (err) => {
    if (err) {
      return next(new AppError(err.message, HTTP_STATUS.BAD_REQUEST));
    }
    next();
  });
};

const uploadToCloudinary = (buffer, folderName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { 
        folder: folderName,
        timestamp: Math.round(Date.now() / 1000) + 10800
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
};

module.exports = {
  uploadFields,
  uploadToCloudinary
};
