const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  name: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: String,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: {
    type: Number
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  }
}, { // Show virtual props each time data outputed as Json or Object
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/*
* durationWeeks is a virtual property which can be easily calculated
* from duration to save little bit of extra storage in DB
* ! NOTE: we used a regular function to get access to this to refer to the actual document
* ? NOTE: we can not query by virtual properties
*/
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

/*
* DOCUMENT MIDDLEWARE(HOOK): runs after save() & create()
* ? NOTE: it doesn't get triggered after running insertMany()
*
**/
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.pre('save', function (next) {
//   console.log('Document is being saved ...');
//   next();
// });

/*
* Post 'save' Hook runs after pre 'save' Hook
**/
// tourSchema.post('save', function (doc, next) {
//   console.log(this.doc);
//   next();
// });

/*
* QUERY MIDDLEWARE: run before executing queries that starts with find (find, findOne, findById ...)
* Filter out secret tours
* ? NOTE: this refers to a query object
*
**/
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
   next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took: ${Date.now() - this.start} milliseconds`);
  console.log(docs);
   next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
