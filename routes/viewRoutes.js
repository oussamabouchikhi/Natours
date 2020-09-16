const express = require('express');
const {getOverview, getTour, getLoginForm, getAccount} = require('../controllers/viewController');
const {isLoggedIn, protect} = require('../controllers/authController');

const router = express.Router();

router.get('/', isLoggedIn, getOverview);
router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/me', protect, getAccount);

module.exports = router;
