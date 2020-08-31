const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.createOne = Model => catchAsync(async (req, res) => {
    const newDoc = await Model.create({});

    res.status(201).json({
      status: 'success',
      data: {
        doc: newDoc
      }
    });
});

exports.getAll = (Model, populateOptions) => catchAsync(async (req, res) => {
    // For nested routes on GET reviews
    let filter = {};
    if (req.body.tour) filter = {tour: req.params.tourId};

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .fieldsLimiting()
      .paginate();
    const document = await features.query; // .explain() to show stats about query

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: document.length,
      data: {
        document
      }
    });
});

exports.getOne = (Model, populateOptions) => catchAsync(async (req, res) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(...populateOptions);
    const document = await query;

    if(!document) {
      return next(new AppError('No document found with that id!', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc: document
      }
    });
});

exports.updateOne = Model => catchAsync(async (req, res) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if(!document) {
      return next(new AppError('No document found with that id!', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document
      }
    });
});

exports.deleteOne = Model => catchAsync(async (req, res) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if(!document) {
      return next(new AppError('No document found with that id!', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
});
