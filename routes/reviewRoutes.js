const express = require('express');
const {
  getAllReviews,
  createReview
} = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
    .get(getAllReviews)
    .post(
      authController.protect,
      authController.restrictTo('user'),
      createReview
    );
