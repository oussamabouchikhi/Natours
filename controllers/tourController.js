const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne
} = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  file.mimetype.startsWith('image')
  ? cb(null, true)
  : cb(new AppError('This type of files is not supported! you can only upload images', 400), false);
}

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

/*
* upload.fields = upload.single('image') + upload.array('images', 5)
* upload.single => req.file | upload.array => req.files
*/
exports.uploadTourImages = upload.fields([
  {name: 'imageCover', maxCount: 1},
  {name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.file.imageCover || !req.file.images) return next();

  // 1)- Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2)- Images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, index) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${index + 1}.jpeg`;
      await sharp(req.file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`)
      req.body.images.push(filename)
    })
  );

  next();
});

/*
 * Get 5 top cheap tours
 * ratingsAverage: descending, price: ascending
 */
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,ratingsAverage,price,summary,difficulty';
  next();
}

exports.createTour  = createOne(Tour);
exports.getAllTours = getAll(Tour);
exports.getTour     = getOne(Tour, {path: 'reviews'});
exports.updateTour  = updateOne(Tour);
exports.deleteTour  = deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res) => {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: {$toUpper: '$difficulty'},
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $max: '$price' },
          maxPrice: { $min: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        // Get each date tours (tours * dates <=> 9 * 3 = 27)
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: { // get only the requested year
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          }
        }
      },
      {
        $group: {
          _id: {$month: '$startDates'},
          numToursStarts: { $sum: 1 }, // add 1 for each doc
          tours: { $push: '$name' }, // display name of tours
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0, // hide id's
        }
      },
      {
        $sort: { numTourStarts: -1 } // sort by number of tours per month descending
      },
      {
        $limit: 12
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
});

exports.getToursWithin = catchAsync(async (req, res) => {
  const {distance, latlng, unit} = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude & longitude in the format lat,lng',
        400
      )
    );
  }

  const tours = await  Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });

});

exports.getDistances = catchAsync(async (req, res) => {
  const {latlng, unit} = req.params;
  const [lat, lng] = latlng.split(',');
  // Covert to miles or kilometers
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude & longitude in the format lat,lng',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});
