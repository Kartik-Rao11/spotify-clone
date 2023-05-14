const express = require('express');
const songController = require('../controllers/songController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(songController.getAllSongs)
  .post(songController.uploadSongFiles, songController.createSong);

router
  .route('/:id')
  .get(authController.protect, songController.getSong)
  .patch(songController.updateSong)
  .delete(
    authController.protect,
    authController.restrictTo('artist', 'admin'),
    songController.deleteSong
  );

module.exports = router;
