const express = require('express');
const validator = require('express-validator');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const path = require('path');

const song = require('./routes/song.route');
const playlist = require('./routes/playlist.route');

const port = process.env.PORT || 3000;
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/music', { useMongoClient: true });

app.use(logger('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(validator());
app.use(fileUpload());

app.use('/', express.static(path.join(__dirname + '/public')));
app.use('/assets', express.static(path.join(__dirname + '/node_modules')));

app.use('/api/song', song);
app.use('/api/playlist', playlist);

app.listen(port);
