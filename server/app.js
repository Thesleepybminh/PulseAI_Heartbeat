var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var rootRouter = require('./routes/index');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files from the Vite build output
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

app.use('/', rootRouter);

// SPA fallback: send index.html for all unmatched routes (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// catch 404 and forward to error handler (this won't be reached for GET requests due to fallback above)
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  const isDev = req.app.get('env') === 'development';
  const status = err.status || 500;
  res.status(status).json({
    message: err.message,
    ...(isDev && { stack: err.stack })
  });
});

module.exports = app;
