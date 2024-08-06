const axios = require('axios');
const catchAsync = require('../utils/catchAsync');

exports.getSpotifyToken = async (req, res, next) => {
    try {
        // Call Spotify API to get access token
        const spotifyTokenResponse = await axios.post('https://accounts.spotify.com/api/token', null, {
            params: {
                grant_type: 'client_credentials'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
            }
        });
        console.log(spotifyTokenResponse)
        // Extract token from response
        const spotifyAccessToken = spotifyTokenResponse.data.access_token;
        return spotifyAccessToken;
        // req.spotifyAccessToken = spotifyAccessToken;
        // // You can save this token in session or send it back to the client
        // req.session.spotifyAccessToken = spotifyAccessToken;
        // await req.session.save((err) => {
        //     if (err) {
        //         console.error('Error saving session:', err);
        //         return res.status(500).json({ message: 'Failed to save session' });
        //     }
        //     console.log('Stored token in session:', req.session.spotifyAccessToken); // Debug log
        //     // res.status(200).json({ message: 'Login successful' });
        //     next();
        // });
    } catch (error) {
        console.error('Error fetching Spotify token:', error);
        return res.status(500).json({ message: 'Failed to fetch Spotify token' });
    }
};

exports.fetchSongs = catchAsync(async (req, res, next) => {
    try {
        const query = req.query.q; // Get search query from request query parameters
        const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: {
                'Authorization': `Bearer ${req.spotifyAccessToken}`
            },
            params: {
                q: query,
                type: 'track',
                limit: 10 // You can adjust the limit as needed
            }
        });
        console.log(response);
        res.status(200).json(response.data.tracks.items);
    } catch (error) {
        console.error('Error fetching songs from Spotify:', error);
        res.status(500).json({ message: 'Failed to fetch songs from Spotify' });
    }
})

