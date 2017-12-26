const express = require('express');
const router = express.Router();
const Playlist = require('../models/playlist.model');
const Song = require('../models/song.model');

router.get('/songs', (req, res) => {
    Song.find()
        .exec((err, songs) => {
            if (err) {
                res.send('Error has occued');
            } else {
                res.json(songs);
            }
        });
});

router.get('/playlists', (req, res) => {
    Playlist.find()
    .populate('songs')
        .exec((err, playlists) => {
            if (err) {
                res.send('Error has occued');
            } else {
                res.json(playlists);
            }
        });
});

router.get('/playlists/name/:name', (req, res) => {
    Playlist.find({
        name: {
            $regex: '.*' + req.params.name + '.*',
            $options: 'i'
        } 
    })
    .populate('songs')
        .exec((err, playlists) => {
            if (err) {
                res.send('Error has occued');
            } else {
                res.json(playlists);
            }
        });
});

router.get('/playlists/genre/:genre', (req, res) => {
    Playlist.find({
        genre: {
            $regex: '.*' + req.params.genre + '.*',
            $options: 'i'
        } 
    })
    .populate('songs')
        .exec((err, playlists) => {
            if (err) {
                res.send('Error has occued');
            } else {
                res.json(playlists);
            }
        });
});

router.get('/song/:id', (req, res) => {
    Song.findOne({
        _id: req.params.id
    })
    .exec((err, song) => {
        if (err) {
            res.send('Error has occued');
        } else {
            res.json(song);
        }
    });
});

router.post('/song', (req, res) => {
    req.checkBody('name', 'Enter a valid playlist name').isAlphanumeric();
    req.checkBody('audio', 'Enter a valid audio name').isAlphanumeric();
    req.checkBody('isFavorite', 'Enter a valid boolean type').isBoolean();

    let errors = req.validationErrors();

    if (errors) {
        res.json({ errors: errors });
    } else {
        Song.create(req.body, (err, song) => {
            if (err) {
                res.send('Error has occued');
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
            res.send('Error has occued');
        } else {
            res.send('Update successfully');
        }
    });
});

router.delete('/song/:id', (req, res) => {
    Song.findOneAndRemove({
        _id: req.params.id
    }, (err, song) => {
        if (err) {
            res.send('Error has occued');
        } else {
            res.send('Deleted successfully');
        }
    });
});

module.exports = router;
