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

const Song = mongoose.model('Song', songSchema, 'songs')

module.exports = Song;
