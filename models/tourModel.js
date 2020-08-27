const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must be 40 characters or less'],
    minlength: [10, 'A tour name must be 10 characters or more'],
    // validate: [validator.isAlpha, 'Tour name must contain only characters']
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
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'difficulty options are either: easy, medium or difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating most be above 1.0'],
    max: [5, 'Rating most be under 5.0']
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
    type: Number,
    validate: {
      validator: function(discount) {
        // this points only to the newly created document
        // so we can't run this type of validators on update
        return discount < this.price
      },
      message: 'Discount price ({VALUE}) must be less then the actual price'
    }
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
  },
  startLocation: {
    // GeoJSON
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  locations: [
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number
    }
  ],
  guides: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ]
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


// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

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
* ? NOTE: this keyword refers to a query object
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

/*
* AGGREGATION MIDDLEWARE: run before executing aggregation
* Exclude secret tours from being used in other results
* ? NOTE: this keyword refers to a aggregation object
*
**/
tourSchema.pre('aggregate', function (docs, next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
