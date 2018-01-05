module.exports.checkFileType = (file, type) => {
    let filetypes;

    switch (type) {
        case 'album': {
                filetypes = /^(jpg|jpeg|png|(image)\/jpg|(image)\/jpeg|(image)\/png)$/;
                break;
            }
        case 'song': {
                filetypes = /^(mp3|MP3|mp3|MP3|(audio)\/mpeg|(audio)\/mp3|(audio)\/MP3)$/;
                break;
            }
        default: {
                return false;
            }
            break;
    }

    const fileExt = file.name.split('.');
    const fileActualExt = fileExt[fileExt.length - 1].toLowerCase();
    const mimetype = file.mimetype.toLowerCase();

    if (filetypes.test(fileActualExt) && filetypes.test(mimetype)) {
        return true;
    } else {
        return false;
    }
}

module.exports.checkFileSize = (file, size) => {
    const maxSize = size * 1000000;
    const fileSize = file.data.toString().length;

    if (fileSize < maxSize) {
        return true;
    } else {
        return false;
    }
}

module.exports.moveFile = (file, type, isArray, cb) => {
    let folder;

    switch (type) {
        case 'album': {
                folder = 'public/images/albums/';
                break;
            }
        case 'song': {
                folder = 'public/songs/';
                break;
            }
        default: {
                return false;
            }
            break;
    }

    if (isArray) {
        let newFileNames = [];

        for (let sepFile of file) {
            const fileExt = sepFile.name.split('.');
            const fileActualExt = fileExt[fileExt.length - 1];
            const newFileName = Date.now() + '.' + fileActualExt;

            sepFile.mv(folder + newFileName, (err) => {
                if (err) {
                    res.status(500).send(err);
                }
            });
            newFileNames.push(newFileName);
        }
        cb(newFileNames);
    } else {
        const fileExt = file.name.split('.');
        const fileActualExt = fileExt[fileExt.length - 1];
        const newFileName = Date.now() + '.' + fileActualExt;
    
        file.mv(folder + newFileName, (err) => {
            if (err) {
                res.status(500).send(err);
            } else {
                cb(newFileName);
            }
        });
    }
}
