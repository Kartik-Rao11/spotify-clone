const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 4,
      trim: true,
      required: [true, 'Please specify playlist name'],
    },
    description: {
      type: String,
      trim: true,
    },
    img: {
      type: String,
      default: 'default.png',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Please specify owner'],
    },
    songs: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'Song',
        },
      ],
      validate: {
        validator: (arr) => arr.length <= 50,
        message: 'You can not add more than 50 songs to your playlist',
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Playlist = new mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
