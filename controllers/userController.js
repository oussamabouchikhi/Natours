const multer = require('multer');
const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const {
  getAll,
  getOne,
  updateOne,
  deleteOne
} = require('./handlerFactory');

// Store & name files(images)
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/users')
  },
  filename: function (req, file, cb) {
    const extension = file.mimetype.split('/')[1];
    const uniqueSuffix = `user-${req.user.id}-${Date.now()}.${extension}`;
    // cb(null, file.fieldname +'-'+ uniqueSuffix);
  }
});

// Check if uploaded files are images
const multerFilter = (req, file, cb) => {
  file.mimetype.startsWith('image')
  ? cb(null, true)
  : cb(new AppError('This type of files is not supported! you can only upload images', 400), false);
}

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
}

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use Signup instead'
  });
};

exports.getAllUsers = getAll(User);
exports.getUser     = getOne(User);
exports.updateUser  = updateOne(User); //! don't update password with this!
exports.deleteUser  = deleteOne(User);
