const Tour       = require('../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError   = require('./../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1)- Get tour data from collection
  const tours = await Tour.find();
  // 2)- Build template (views/overview.pug)
  // 3)- Render tha template usnig tour date from 1)
  res.status(200).render('overview', {
    title: 'All tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1)- Get tour data from the requested tour (including reviews & guides)
  const tour = await Tour.findOne({slug: req.params.slug}).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  
  // 2)- Build template (views/tour.pug)
  // 3)- Render tha template usnig tour date from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
}
