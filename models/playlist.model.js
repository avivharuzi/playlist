const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const playlistSchema = new Schema({
    name: {
        type: String,
        index: true,
        unique: true
    },
    image: String,
    genre: String,
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],
    isFavorite: Boolean
});

const Playlist = mongoose.model('Playlist', playlistSchema, 'playlist');

module.exports = Playlist;
