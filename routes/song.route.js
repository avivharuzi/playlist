const express = require('express');
const router = express.Router();
const Song = require('../models/song.model');

router.get('/', (req, res) => {
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

router.get('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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
