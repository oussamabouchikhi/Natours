const Tour = require('../models/tourModel');

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

exports.getAllTours = async (req, res) => {

  try {
    // BUILD QUERY
    // 1) a- Filtering
    const queryObj = {...req.query};
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);
    // console.log(req.query, queryObj);

    // 1) b- Advanced Filtering
    /*
    * As we filter difficulty[gte]=5 we will get an object {difficulty: {gte: 5}}
    * so we want to replace these filters with MongoDB functions i.e: $gte
    * \b\b : to match the exact word, g: replace all filters if we have multiple
    */
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // 2)- Sorting
    /*
    * Ascending: sort=criteria, Descending: sort=-criteria
    * Sort by another criteria if we have similar ones
    * sort=criteria1,criteria2 => sort('criteria1 criteria2')
    */
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else { // default sort
      query = query.sort('-createdAt');
    }

    // 3)- Fields Limiting
    /* Select(project) only specified fields */
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else { // default fields
      query = query.select('-__v'); // exclude __v field
    }

    // 4)- Pagination
    /*
     *
     * limit: number of records to show per page
     * skip: number of records to be skipped
     * ex: page 1: 1-10, page 2: 11-20, page 3: 21-30
     */
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numberOfTours = await Tour.countDocuments();
      if (skip > numberOfTours) throw new Error('This page does not exist!');
    }

    // EXECUTE QUERY
    const tours = await query;

    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    // const tour = await Tour.findOne({_id: req.params.id});
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save();
    const newTour = await Tour.create({});

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
