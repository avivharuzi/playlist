const Playlist = require('../models/playlist.model');
const songController = require('./song.controller');

module.exports.setPlaylist = (playlistName, album, genre, existSongs, songAudios, songNames, playlistId, res) => {
    uploadSongsAndGetFinallyIds(songNames, songAudios, existSongs, (finallySongIds) => {
        if (playlistId === '') {
            let newPlaylist = Playlist({
                name: playlistName,
                image: album,
                genre: genre,
                songs: finallySongIds,
                isFavorite: false
            });
            newPlaylist.save((err, playlist) => {
                if (err) {
                    return res.json({
                        response: false,
                        errors: err,
                        message: 'Their was problem by adding your playlist',
                        type: 'create'
                    });
                } else {
                    return res.json({
                        response: true,
                        message: 'This playlist added successfully',
                        type: 'create',
                        data: playlist
                    });
                }
            });
        } else {
            Playlist.findOneAndUpdate({
                _id: playlistId
            }, {
                $set: {
                    name: playlistName,
                    image: album,
                    genre: genre,
                    songs: finallySongIds
                }
            }, {
                upsert: true
            }, (err, newPlaylist) => {
                if (err) {
                    res.json({
                        response: false,
                        message: 'There was problem by update this playlist',
                        type: 'update'
                    });
                } else {
                    Playlist.findById(newPlaylist._id).populate('songs').exec(function(err, data) {
                        res.json({
                            response: true,
                            message: 'This playlist updated successfully',
                            type: 'update',
                            data: data
                        });
                    });
                }
            });
        }
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

function checkExistPlaylist(playlistName, isPlaylistNameDuplicate, cb) {
    if (isPlaylistNameDuplicate === true) {
        cb(false);
    } else {
        Playlist.findOne({
            name: playlistName
        }).exec((err, playlist) => {
            if (playlist) {
                cb(true);
            } else {
                cb(false);
            }
        });
    }
}

module.exports.checkExistOverall = (playlistName, isPlaylistNameDuplicate, songNames, cb) => {
    checkExistPlaylist(playlistName, isPlaylistNameDuplicate, (isPlaylist) => {
        songController.checkExistSongs(songNames, (isSongs, songs) => {
            let errors = [];

            if (isPlaylist) {
                errors.push('Playlist name is already in used');
            }

            if (isSongs) {
                for (let song of songs) {
                    errors.push('Song ' + song.name + ' is already in used');
                }
            }

            if (errors.length > 0) {
                cb(true, errors);
            } else {
                cb(false, errors);
            }
        });
    });
}

module.exports.checkIfFavorite = (playlistId, cb) => {
    Playlist.findOne({
        _id: playlistId
    }).exec((err, playlist) => {
        if (playlist.isFavorite) {
            cb(false);
        } else {
            cb(true);
        }
    });
}
