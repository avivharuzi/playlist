const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/albums');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).any();

function checkFileType(file, cb) {
    const filetypes = /^(.jpg|.jpeg|.png|(image)\/jpg|(image)\/jpeg|(image)\/png)$/;
    const extname = filetypes.test(path.extname(file.originalname));
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('You can upload only image files');
    }
}

module.exports = upload;
