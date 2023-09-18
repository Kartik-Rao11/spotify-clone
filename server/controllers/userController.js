const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[0] === 'image') {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'));
  }
};

const upload = multer({ storage, fileFilter });

exports.uploadPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(520, 520)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/users/${req.file.filename}`);

  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Check if user posted their password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('🚫 This route is not for password updates.', 400)
    );
  }

  // 2) Update user data
  const userData = {};

  if (req.body.name) userData.name = req.body.name;
  if (req.body.email) userData.email = req.body.email;
  if (req.file) userData.img = req.file.filename;

  const user = await User.findByIdAndUpdate(req.user.id, userData, {
    new: true,
    runValidators: true,
  });

  const serverUrl = `${req.protocol}://${req.get('host')}/`;
  user.photo = `${serverUrl}public/users/${user.photo}`;

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.getArtist = catchAsync(async (req, res, next) => {
  const artist = await User.findById(req.params.id).populate('songs');

  if (!artist || artist.role !== 'artist') {
    return next(new AppError('No artist found with that ID', 404));
  }

  const serverUrl = `${req.protocol}://${req.get('host')}/`;
  artist.songs.map((song) => {
    song.song = `${serverUrl}public/songs/${song.song}`;
    song.img = `${serverUrl}public/songs/${song.img}`;
  });

  res.status(200).json({
    status: 'success',
    data: artist,
  });
});

exports.followArtist = catchAsync(async (req, res, next) => {
  const artist = await User.findById(req.params.id);

  if (!artist || artist.role !== 'artist') {
    return next(new AppError('You can only follow artists', 404));
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { followedArtists: req.params.id } },
    { runValidators: true, new: true }
  ).populate('followedArtists', 'name img role');

  const serverUrl = `${req.protocol}://${req.get('host')}/`;
  user.followedArtists.map((artist) => {
    artist.img = `${serverUrl}public/users/${artist.img}`;
  });

  res.status(200).json({
    status: 'success',
    data: user.followedArtists,
  });
});

exports.unfollowArtist = catchAsync(async (req, res, next) => {
  const artist = await User.findById(req.params.id);

  if (!artist || artist.role !== 'artist') {
    return next(new AppError('No artist found with that id', 404));
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { followedArtists: req.params.id } },
    { runValidators: true, new: true }
  ).populate('followedArtists', 'name img role');

  const serverUrl = `${req.protocol}://${req.get('host')}/`;
  user.followedArtists.map((artist) => {
    artist.img = `${serverUrl}public/users/${artist.img}`;
  });

  res.status(200).json({
    status: 'success',
    data: user.followedArtists,
  });
});

// Likes
exports.getLikedSongs = catchAsync(async (req, res, next) => {
  // REVIEW: If logged in used is artist user info is populated twice
  const user = await User.findById(req.user.id).populate('likedSongs');

  res.status(200).json({
    status: 'success',
    data: {
      songs: user.likedSongs,
    },
  });
});

exports.likeSong = catchAsync(async (req, res, next) => {
  const { song } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { likedSongs: song } },
    { runValidators: true, new: true }
  ).populate('likedSongs');

  const serverUrl = `${req.protocol}://${req.get('host')}/`;
  user.likedSongs.map((song) => {
    song.song = `${serverUrl}public/songs/${song.song}`;
    song.img = `${serverUrl}public/songs/${song.img}`;
  });

  res.status(200).json({
    status: 'success',
    songs: user.likedSongs,
  });
});

exports.dislikeSong = catchAsync(async (req, res, next) => {
  const { song } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { likedSongs: song } },
    { runValidators: true, new: true }
  ).populate('likedSongs');

  const serverUrl = `${req.protocol}://${req.get('host')}/`;
  user.likedSongs.map((song) => {
    song.song = `${serverUrl}public/songs/${song.song}`;
    song.img = `${serverUrl}public/songs/${song.img}`;
  });

  res.status(200).json({
    status: 'success',
    songs: user.likedSongs,
  });
});
