const express = require('express');

const router = express.Router();

module.exports = () => {
  router.get('/', (req, res) => {
    res.send('Speakers list');
  });
  // eslint-disable-next-line arrow-body-style
  router.get('/:shortname', (req, res) => {
    return res.send(`Detail page of ${req.params.shortname}`);
  });
  return router;
};
