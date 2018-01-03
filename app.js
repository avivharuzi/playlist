const express = require('express');
const validator = require('express-validator');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const api = require('./routes/api');

const app = express();
const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/music', { useMongoClient: true });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(validator());
app.use(fileUpload());

app.use('/', express.static(path.join(__dirname + '/public')));
app.use('/assets', express.static(path.join(__dirname + '/node_modules')));

app.use('/api', api);

app.listen(port);
