import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  logoutUser,
  resetPassword,
  requestResetEmail,
  refreshUserSession,
  registerUser,
  uploadAvatar,
} from '../controllers/authController.js';
import authenticate from '../middleware/authenticate.js';
import uploadAvatarMiddleware from '../middleware/uploadAvatar.js';
import {
  registerUserSchema,
  resetPasswordSchema,
  requestResetEmailSchema,
} from '../validations/authValidation.js';

const authRouter = Router();

authRouter.post('/register', celebrate(registerUserSchema), registerUser);
authRouter.post(
  '/request-reset-email',
  celebrate(requestResetEmailSchema),
  requestResetEmail,
);
authRouter.post('/reset-password', celebrate(resetPasswordSchema), resetPassword);
authRouter.patch(
  '/avatar',
  authenticate,
  uploadAvatarMiddleware.single('avatar'),
  uploadAvatar,
);
authRouter.post('/refresh', refreshUserSession);
authRouter.post('/logout', logoutUser);

export default authRouter;
