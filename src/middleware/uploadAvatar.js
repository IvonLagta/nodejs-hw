import { mkdirSync } from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import createHttpError from 'http-errors';

const avatarsDir = path.resolve('uploads', 'avatars');
mkdirSync(avatarsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname) || '.jpg';
    cb(null, `${req.user._id.toString()}-${Date.now()}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(createHttpError(400, 'Avatar must be an image file'));
    return;
  }

  cb(null, true);
};

const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default uploadAvatar;
