const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const indexRouter = require('./server/routes/index');
const logger = require('./server/middleware/logger');

const app = express();

// View Engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'pug');

// MIDDLEWARE BEGIN
/* Static file Middleware
** https://expressjs.com/en/starter/static-files.html
** https://expressjs.com/en/4x/api.html#express.static
*/
app.use(express.static(path.join(__dirname, 'client')));

/* Body Parsing Middleware
** https://expressjs.com/en/4x/api.html#express.json
** https://expressjs.com/en/4x/api.html#express.urlencoded
*/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cookie Parsing Middleware
app.use(cookieParser());

// Logging Middleware
app.use(morgan('dev', {
  skip: function (req, res) {
      return res.statusCode < 400
  }, stream: process.stderr
}));
app.use(morgan('dev', {
  skip: function (req, res) {
      return res.statusCode >= 400
  }, stream: process.stdout
}));
//sample custom middleware
app.use(function(req, res, next) {
  logger.info('test log');
  next();
});

// Routing 
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  logger.error('404 page requested');
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  logger.error(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
