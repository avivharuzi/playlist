const Song = require('../models/song.model');
const fileController = require('./file.controller');

module.exports.setSongs = (songAudios, songNames, cb) => {
    fileController.moveFile(songAudios, 'song', true, (songAudiosName) => {
        songObjArr = songToObjArr(songNames, songAudiosName);

        Song.create(songObjArr, (err, songs) => {
            if (err) {
                throw err;
            } else {
                cb(getIds(songs));
            }
        });
    });
}

function saveSong(_name, _audio, cb) {
    let newSong = Song({
        name: _name,
        audio: _audio
    });
    newSong.save((err, song) => {
        if (err) {
            throw err;
        } else {
            cb(song._id);
        }
    });
}

function songToObjArr(names, audios) {
    let newArr = [];
    for (let i = 0; i < names.length; i++) {
        newArr.push({ name: names[i], audio: audios[i]});
    }
    return newArr;
}

function getIds(songs) {
    let ids = [];
    for (let song of songs) {
        ids.push(song._id);
    }
    return ids;
}

module.exports.checkExistSongs = (songNames, cb) => {
    Song.find({
        name: songNames
    }).exec((err, songs) => {
        if (songs) {
            if (songs.constructor !== Array) {
                songs = [songs];
            }
            cb(true, songs);
        } else {
            cb(false, songs);
        }
    });
}
