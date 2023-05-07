const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

module.exports = (params) => {
  const { feedbackService } = params;

  router.get('/', async (req, res, next) => {
    try {
      const feedback = await feedbackService.getList();

      const errors = req.session.feedback ? req.session.feedback.errors : false;
      req.session.feedback = {};
      return res.render('layout', {
        pageTitle: 'Feedback',
        template: 'feedback',
        feedback,
        errors,
      });
    } catch (error) {
      return next(error);
    }
  });
  router.post(
    '/',
    [
      check('name').trim().isLength({ min: 3 }).escape().withMessage('Name is a required entity'),
      check('email')
        .trim()
        .isEmail()
        .normalizeEmail() // converts email address to lowercase
        .withMessage('Valid email address is required'),
      check('title').trim().isLength({ min: 3 }).escape().withMessage('Title is required'),
      check('message').trim().isLength({ min: 5 }).escape().withMessage('Message is required'),
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.session.feedback = {
          errors: errors.array(),
        };
        return res.redirect('/feedback');
      }
      return res.send('Feedback posted');
    }
  );

  return router;
};
