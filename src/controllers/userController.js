import createHttpError from 'http-errors';
import User from '../models/user.js';
import saveFileToCloudinary from '../utils/saveFileToCloudinary.js';

export const updateUserAvatar = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, 'No file');
  }

  const cloudinaryResult = await saveFileToCloudinary(req.file.buffer);
  const avatarUrl = cloudinaryResult.secure_url;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: avatarUrl },
    { new: true },
  );

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  return res.status(200).json({
    url: user.avatar,
  });
};
