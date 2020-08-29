const Review = require('../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne
} = require('./handlerFactory');


exports.setTourAndUserIDs = (req, res, next) => {
  req.body.tour = req.body.tour || req.params.tourId;
  req.body.user = req.body.user || req.user.id;
}

exports.createReview  = createOne(Review);
exports.getAllReviews = getAll(Review);
exports.getReview     = getOne(Review);
exports.updateReview  = updateOne(Review);
exports.deleteReview  = deleteOne(Review);
