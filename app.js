const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const authRouter = require('./routes/auth');
const {sendEmails} = require('./routes/menus');
const nodeCron = require('node-cron');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);


const Realm = require('realm-web')
const {APPID} = require("/utils/environment")

const realmApp = new Realm.App({
  id: APPID,
});
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

nodeCron.schedule('0 0 1 * * *', () => {
  sendEmails().then(r=> r)
})


module.exports = app;







