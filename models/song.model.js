const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const songSchema = new Schema({
    name: String,
    audio: String,
    isFavorite: Boolean
});

var Song = mongoose.model('Song', songSchema, 'song')

module.exports = Song;
