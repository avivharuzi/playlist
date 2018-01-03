const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/songs');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
  
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20000000
    },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).any();

function checkFileType(file, cb) {
    const filetypes = /^(mp3|MP3|.mp3|.MP3|(audio)\/mpeg|(audio)\/mp3|(audio)\/MP3)$/;
    const extname = filetypes.test(path.extname(file.originalname));
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('You can upload only mp3 files');
    }
}

module.exports = upload;
