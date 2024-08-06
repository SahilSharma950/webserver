const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/forgot-password', authController.forgotpassword);
router.post('/reset-password/:token', authController.resetpassword);


module.exports = router;