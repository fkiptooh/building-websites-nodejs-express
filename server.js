/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');

const bodyParser = require('body-parser');

const port = 3000;
// const { name } = require('ejs');

const SpeakersService = require('./services/SpeakerService');
const FeedbackService = require('./services/FeedbackService');

const speakersService = new SpeakersService('./data/speakers.json');
const feedbackService = new FeedbackService('./data/feedback.json');

const routes = require('./routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.locals.siteName = 'ROUX Meetups';

app.use(express.static(path.join(__dirname, './static')));
// app.get(`/throw`, (req, res, next) => {
//   setTimeout(() => next(new Error('Something went wrong')), 500);
// });

app.use(async (req, res, next) => {
  try {
    const names = await speakersService.getNames();
    res.locals.speakerNames = names;
    return next();
  } catch (err) {
    return next(err);
  }
});

app.set('trust proxy', 1);
app.use(
  cookieSession({
    name: 'session',
    keys: ['sgsfwt5652', 'hasgfws65265'],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes({ speakersService, feedbackService }));

app.use((req, res, next) => next(createError(404, 'Page not found')));

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  const status = err.status || 500;
  res.locals.status = status;
  res.status(status);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
