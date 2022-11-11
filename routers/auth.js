const express = require('express');

const router = express.Router();

const { check, body } = require('express-validator');
const authController = require('../controllers/auth');
const User = require('../models/user');

// GET /auth/signup
router.get('/signup', authController.getSignup);

// POST /auth/signup
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            );
          }
        });
      })
      .normalizeEmail(),
    body('name', 'Please enter a name at least 5 characters.').isLength({
      min: 5,
    }),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 5 characters.'
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      }),
  ],
  authController.postSignup
);

// GET /auth/login
router.get('/login', authController.getLogin);

// POST /auth/login
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password', 'Password has to be valid.')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

// POST /auth/logout
router.post('/logout', authController.postLogout);

// GET /auth/reset
router.get('/reset', authController.getReset);

// POST /auth/reset
router.post('/reset', authController.postReset);

// GET /auth/reset/:token
router.get('/reset/:token', authController.getNewPassword);

// POST /auth/new-password
router.post('/new-password', authController.postNewPassword);

module.exports = router;
