const catchAsync = require("../utils/catchAsync");

exports.attachSpotifyToken = catchAsync(async (req, res, next) => {
    if (req.cookies.spotifyAccessToken) {
        req.spotifyAccessToken = req.cookies.spotifyAccessToken;
        next();
    } else {
        res.status(401).json({ message: 'Spotify token not found. Please log in again.' });
    }
});

// module.exports = attachSpotifyToken;
