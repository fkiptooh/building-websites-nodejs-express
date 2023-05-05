const express = require('express');

const path = require('path');

const app = express();
const routes = require('./routes');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(express.static(path.join(__dirname, './static')));

app.use('/', routes());

const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
