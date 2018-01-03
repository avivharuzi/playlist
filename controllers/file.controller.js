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

module.exports.moveFile = (file, type) => {
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
    
    console.log(folder);

    const fileExt = file.name.split('.');
    const fileActualExt = fileExt[fileExt.length - 1];

    const newFileName = Date.now() + '.' + fileActualExt;

    console.log(newFileName);

    file.mv(folder + newFileName, (err) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            return newFileName;
        }
    });
}
