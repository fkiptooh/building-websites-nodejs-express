/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
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

app.use('/', routes({ speakersService, feedbackService }));

const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
