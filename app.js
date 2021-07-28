var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload= require('express-fileupload')
var usersRouter = require('./routes/users');
var picturesRouter = require('./routes/pictures');
var chatsRouter = require('./routes/chats');
var repliesRouter = require('./routes/reply');
var dealsRouter = require('./routes/deals');

const db = require('./config/db');

// Connect to DB
db.connect();

// 
var app = express();
// Use cors
var cors = require('cors');
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/pictures', picturesRouter);
app.use('/chats', chatsRouter);
app.use('/replies', repliesRouter);
app.use('/deals', dealsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
