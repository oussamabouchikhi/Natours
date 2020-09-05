const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review cannot be empty']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belong to a tour']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review Review must belong to a user']
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/* Prevent duplicate reviews
* both userId & tourId must be unique at the same time
* to not let the same user make multiple reviews on the same tour
*/
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });
  this.populate({
    path: 'user',
    select: 'name photo'
  });

  next();
});

/*
* 'this' refers to the Review Model
**/
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        numRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      }
    }
  ]);

  if ( stats.length > 0 ) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].numRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
}

/*
* 'this' refers to the current document (a review)
* 'this.constructor' refers to the Review Model
*/
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

/*
* findByIdAndUpdate & findByIdAndDelete | ById => One (shorthand)
* Get current doc & pass it from pre to post middleware (trick)
* Since we cannot perform findOne on post middleware because the QUERY is already executed
*/

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.rev = await this.findOne(); // Get current review
  next()
});
reviewSchema.post(/^findOneAnd/, async function () {
  await this.rev.constructor.calcAverageRatings(this.rev.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
