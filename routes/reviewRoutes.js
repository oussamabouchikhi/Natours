const express = require('express');
const {
  getAllReviews,
  setTourAndUserIDs,
  createReview,
  getReview,
  updateReview,
  deleteReview
} = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

// mergeParams: allow access tour & user params
const router = express.Router({ mergeParams: true });

router
  .route('/')
    .get(getAllReviews)
    .post(
      authController.protect,
      authController.restrictTo('user'),
      setTourAndUserIDs,
      createReview
    );

router
  .route('/:id')
    .get(getReview)
    .patch(updateReview)
    .delete(deleteReview)
