const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const songSchema = new Schema({
    name: {
        type: String,
        index: true,
        unique: true
    },
    audio: String
});

var Song = mongoose.model('Song', songSchema, 'song')

module.exports = Song;
