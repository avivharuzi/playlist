const Playlist = require('../models/playlist.model');
const songController = require('./song.controller');

module.exports.setPlaylist = (playlistName, album, genre, existSongs, songAudios, songNames, res) => {
    uploadSongsAndGetFinallyIds(songNames, songAudios, existSongs, (finallySongIds) => {
        let newPlaylist = Playlist({
            name: playlistName,
            image: album,
            genre: genre,
            songs: finallySongIds,
            isFavorite: false
        });
        newPlaylist.save((err) => {
            if (err) {
                return res.json({
                    response: false,
                    errors: err,
                    message: 'Their was problem by adding your playlist'
                })
            } else {
                return res.json({
                    response: true,
                    message: 'This playlist added successfully'
                })
            }
        });
    });
}

function uploadSongsAndGetFinallyIds(songNames, songAudios, existSongs, cb) {
    if (songNames.length > 0 && songAudios.length > 0) {
        songController.setSongs(songAudios, songNames, (songAudioIds) => {
            let finallySongIds;
            if (existSongs.length > 0) {
                finallySongIds = songAudioIds.concat(existSongs);
            } else {
                finallySongIds = songAudioIds;
            }
            cb(finallySongIds);
        });
    } else {
        cb(existSongs);
    }
}
