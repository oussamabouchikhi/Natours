const express = require('express');
const {getOverview, getTour, getLoginForm} = require('../controllers/viewController');
const {isLoggedIn} = require('../controllers/authController');

const router = express.Router();

router.get('/', isLoggedIn);

router.get('/', getOverview);
router.get('/tour/:slug', getTour);
router.get('/login', getLoginForm);

module.exports = router;
