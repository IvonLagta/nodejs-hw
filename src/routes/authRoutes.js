import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  logoutUser,
  refreshUserSession,
  registerUser,
} from '../controllers/authController.js';
import { registerUserSchema } from '../validations/authValidation.js';

const authRouter = Router();

authRouter.post('/register', celebrate(registerUserSchema), registerUser);
authRouter.post('/refresh', refreshUserSession);
authRouter.post('/logout', logoutUser);

export default authRouter;
