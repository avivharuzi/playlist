const express = require('express');
const router = express.Router();
const Playlist = require('../models/playlist.model');
const Song = require('../models/song.model');
const validation = require('../controllers/validation.controller');
const fileController = require('../controllers/file.controller');
const playlistController = require('../controllers/playlist.controller');
const songController = require('../controllers/song.controller');

function problem(res) {
    return res.json({
        response: false,
        message: 'There was problem with this request'
    });
}

router.get('/playlist', (req, res) => {
    Playlist.find()
    .populate('songs')
        .exec((err, playlists) => {
            if (err) {
                problem(res);
            } else if (playlists == false) {
                res.json({
                    response: false,
                    message: 'There are no playlists'
                });
            } else {
                res.json(playlists);
            }
        });
});

router.get('/playlist/favorite', (req, res) => {
    Playlist.find({
        isFavorite: true
    })
    .populate('songs')
        .exec((err, playlists) => {
            if (err) {
                problem(res);
            } else if (playlists == false) {
                res.json({
                    response: false,
                    message: 'There are no favorite playlists'
                });
            } else {
                res.json(playlists);
            }
        });
});

router.get('/playlist/:id', (req, res) => {
    Playlist.find({
        _id: req.params.id
    })
    .populate('songs')
        .exec((err, playlists) => {
            if (err) {
                res.json({
                    response: false,
                    message: 'There are no playlist with this id'
                });
            } else {
                res.json(playlists);
            }
        });
});

router.get('/playlist/name/:name', (req, res) => {
    Playlist.find({
        name: {
            $regex: '.*' + req.params.name + '.*',
            $options: 'i'
        } 
    })
    .populate('songs')
        .exec((err, playlists) => {
            if (err) {
                problem(res);
            } else if (playlists == false) {
                res.json({
                    response: false,
                    message: 'No playlists found by this name'
                });
            } else {
                res.json(playlists);
            }
        });
});

router.get('/playlist/genre/:genre', (req, res) => { 
    Playlist.find({
        genre: {
            $regex: '.*' + req.params.genre + '.*',
            $options: 'i'
        } 
    })
    .populate('songs')
        .exec((err, playlists) => {
            if (err) {
                problem(res);
            } else if (playlists == false) {
                res.json({
                    response: false,
                    message: 'No playlists found by this genre'
                });
            } else {
                res.json(playlists);
            }
        });
});

router.post('/playlist', (req, res) => {
    let errors = [];

    let playlistName = '';
    let genre = '';
    let album = '';
    let songNames = '';
    let songAudios = '';
    let existSongs = '';
    
    if (req.body.existSongs) {
        existSongs = req.body.existSongs;
    }

    if (req.files) {
        if ('album' in req.files) {
            album = req.files.album;
        }

        if ('songs' in req.files) {
            if (req.files.songs.constructor === Array) {
                songAudios = req.files.songs;
            } else {
                songAudios = [req.files.songs];
            }
        }
    }

    if (!validation(req.body.playlistName, /^[A-Za-z0-9!@#$%^&*()_., ]{3,255}$/)) {
        errors.push('Playlist name is invalid');
    } else {
        playlistName = req.body.playlistName;
    }

    if (!validation(req.body.genre, /^[A-Za-z0-9 &]{3,55}$/)) {
        errors.push('Genre name is invalid');
    } else {
        genre = req.body.genre;
    }

    if (req.body.songName) {
        if (req.body.songName.constructor === Array) {
            songNames = req.body.songName;
        } else {
            songNames = [req.body.songName];
        }

        for (let songName of songNames) {
            if (!validation(songName, /^[A-Za-z0-9!@#$%^&*()_., -]{3,255}$/)) {
                errors.push('Song name is invalid');
                break;
            }
        }
    }

    if (album === '') {
        album = null;
    } else if (!fileController.checkFileType(album, 'album')) {
        errors.push('Only images are accepeted');
    } else if (!fileController.checkFileSize(album, 1)) {
        errors.push('The size of this image is too large');
    }

    if (songAudios !== '') {
        for (let songAudio of songAudios) {
            if (!fileController.checkFileType(songAudio, 'song')) {
                errors.push('Song is invalid');
                break;
            } else if (!fileController.checkFileSize(songAudio, '20')) {
                errors.push('The size of the song is too large');
                break;
            }
        }
    }

    if (songNames.length !== songAudios.length) {
        errors.push('You have a missing arguments in your songs');
    }

    if (songNames === '' && existSongs === '' && songAudios === '') {
        errors.push('You need to choose at least one song to add your new playlist');
    }

    if (errors.length === 0) {
        if (album !== null) {
            fileController.moveFile(album, 'album', false, (image) => {
                album = image;
                playlistController.setPlaylist(playlistName, album, genre, existSongs, songAudios, songNames, res);
            });
        } else {
            playlistController.setPlaylist(playlistName, album, genre, existSongs, songAudios, songNames, res);
        }
    } else {
        res.json({
            response: false,
            errors: errors
        });
    }
});

router.delete('/playlist/:id', (req, res) => {
    Playlist.findOneAndRemove({
        _id: req.params.id
    }, (err, playlist) => {
        if (err) {
            problem(res);
        } else {
            res.json({
                response: true,
                message: 'Playlist deleted successfully'
            });
        }
    });
});

router.get('/song', (req, res) => {
    Song.find()
        .exec((err, songs) => {
            if (err) {
                res.json({
                    response: false,
                    message: 'There are no songs'
                });
            } else {
                res.json(songs);
            }
        });
});

router.get('/song/:id', (req, res) => {
    Song.findOne({
        _id: req.params.id
    })
    .exec((err, song) => {
        if (err) {
            res.json({
                response: false,
                message: 'There are no song with this id'
            });
        } else {
            res.json(song);
        }
    });
});

router.post('/song', (req, res) => {
    req.checkBody('name', 'Invalid song name').isAlphanumeric();

    let errors = req.validationErrors();

    if (errors) {
        res.json({
            errors: errors
        });
    } else {
        Song.create(req.body, (err, song) => {
            if (err) {
                res.json({
                    response: false,
                    message: 'There was problem by adding this song'
                });
            } else {
                res.json(song);
            }
        }); 
    }
});

router.put('/song/:id', (req, res) => {
    Song.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: {
            name: req.body.name
        }
    }, {
        upsert: true
    }, (err, newSong) => {
        if (err) {
            res.json({
                response: false,
                message: 'There was problem by update this song'
            });
        } else {
            res.json({
                response: true,
                message: 'This song updated successfully'
            });
        }
    });
});

router.delete('/song/:id', (req, res) => {
    Song.findOneAndRemove({
        _id: req.params.id
    }, (err, song) => {
        if (err) {
            res.json({
                response: false,
                message: 'There was problem by deleting this song'
            });
        } else {
            res.json({
                response: true,
                message: 'This song deleted successfully'
            });
        }
    });
});

module.exports = router;
