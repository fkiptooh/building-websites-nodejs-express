const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const validation = [
  check('name').trim().isLength({ min: 3 }).escape().withMessage('Name is a required entity'),
  check('email')
    .trim()
    .isEmail()
    .normalizeEmail() // converts email address to lowercase
    .withMessage('Valid email address is required'),
  check('title').trim().isLength({ min: 3 }).escape().withMessage('Title is required'),
  check('message').trim().isLength({ min: 5 }).escape().withMessage('Message is required'),
];

module.exports = (params) => {
  const { feedbackService } = params;

  router.get('/', async (req, res, next) => {
    try {
      const feedback = await feedbackService.getList();

      const errors = req.session.feedback ? req.session.feedback.errors : false;
      const successMessage = req.session.feedback ? req.session.feedback.message : false;
      req.session.feedback = {};
      return res.render('layout', {
        pageTitle: 'Feedback',
        template: 'feedback',
        feedback,
        errors,
        successMessage,
      });
    } catch (error) {
      return next(error);
    }
  });
  router.post('/', validation, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.session.feedback = {
          errors: errors.array(),
        };
        return res.redirect('/feedback');
      }
      const { name, email, title, message } = req.body;

      await feedbackService.addEntry(name, email, title, message);
      req.session.feedback = {
        message: 'Thank you for your feedback',
      };
      return res.redirect('/feedback');
    } catch (error) {
      return next(error);
    }
  });

  router.post(`/api`, validation, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() });
      }
      const { name, email, title, message } = req.body;

      await feedbackService.addEntry(name, email, title, message);
      const feedback = await feedbackService.getList();
      return res.json({ feedback, successMessage: 'Thank you for your feedback' });
    } catch (error) {
      return next(error);
    }
  });
  return router;
};
