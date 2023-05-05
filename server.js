const express = require('express');

const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, './static')));

const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './static/index.html'));
});

app.get(`/speakers`, (req, res) => {
  res.sendFile(path.join(__dirname, './static/speakers.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
