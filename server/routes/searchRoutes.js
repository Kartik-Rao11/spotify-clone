const express = require('express');
const searchController = require('../controllers/searchController');
const spotifyController = require('../controllers/spotifyController');
const { attachSpotifyToken } = require('../middlewares/attachSpotifyToken');
const router = express.Router();

router.get('/song', attachSpotifyToken, spotifyController.fetchSongs);
router.get('/playlist', searchController.searchPlaylist);
router.get('/artist', searchController.searchArtist);

module.exports = router;
