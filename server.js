/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');

const SpeakersService = require('./services/SpeakerService');
const FeedbackService = require('./services/FeedbackService');

const speakersService = new SpeakersService('./data/speakers.json');
const feedbackService = new FeedbackService('./data/feedback.json');

const routes = require('./routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(express.static(path.join(__dirname, './static')));

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
