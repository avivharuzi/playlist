const express = require('express');
const router = express.Router();
const Playlist = require('../models/playlist.model');
const Song = require('../models/song.model');
const file = require('../controllers/file.controller');
const validation = require('../controllers/validation.controller');

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

// const playlistFd = upload.fields([{name: 'playlistName'}, {name: 'genre'}, {name: 'songName'}, {name: 'album'}, {name: 'songs'}]);

router.post('/playlist', (req, res) => {
    let errors = [];

    let songs = req.files.songs;
    let album = req.files.album;

    // if (!validation(req.body.playlistName, /^[A-Za-z0-9!@#$%^&*()_. ]{3,255}$/)) {
    //     errors.push('Playlist name is invalid');
    // }

    // Playlist.findOne({
    //     name: req.body.playlistName
    // }).exec((err, playlist) => {
    //     if (playlist) {
    //         errors.push('Playlist name is already in used');
    //     }
    // });

    // if (!validation(req.body.genre, /^[A-Za-z0-9 &]{3,55}$/)) {
    //     errors.push('Genre name is invalid');
    // }

    // for (let songName of req.body.songName) {
    //     if (!validation(songName, /^[A-Za-z0-9!@#$%^&*()_. -]{3,255}$/)) {
    //         errors.push('Song name is invalid');
    //         break;
    //     } else if (Song.find({ name: songName })) {
    //         errors.push('Song name is already in used');
    //         break;
    //     }
    // }

    // console.log(req.body.playlistName);
    // console.log('===========================');
    // console.log(req.body.genre);
    // console.log('===========================');
    // console.log(req.body.songName);
    // console.log('===========================');
    // console.log(req.body.existSongs);
    // console.log('===========================');
    // console.log(req.files.album);
    // console.log('===========================');
    // console.log(req.files.songs);

    if (album === undefined) {
        album = null;
    } else if (!file.checkFileType(album, 'album')) {
        errors.push('Image is invalid');
    }

    if (songs !== undefined) {
        for (let song of songs) {
            if (!file.checkFileType(song, 'song')) {
                errors.push('Song is invalid');
                break;
            } else {
                file.moveFile(song, 'song');
            }
        }
    }

    console.log(req.files.album.data.toString().length);
    console.log('======');
    console.log(file.checkFileSize(album, 20));

    if (!errors) {
        res.json({
            response: true
        });
    } else {
        res.json({
            response: false,
            errors: errors
        })
    }

    // console.log(req.body.existSongs);
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
