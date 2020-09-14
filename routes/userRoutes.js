const express = require('express');
const {getMe, updateMe, deleteMe, getAllUsers, createUser, getUser, updateUser, deleteUser} = require('./../controllers/userController');
const {signup, login, logout, forgotPassword, resetPassword, protect, updatePassword, restrictTo} = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword/:token', resetPassword);

// All routes after this middleware require authentication
router.use(protect);

router.patch(
  '/updateMyPassword',
  updatePassword
);

router.get('/me', getMe, getUser);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

// Only admins that are allowed to access below routes
router.use(restrictTo('admin'));

router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
