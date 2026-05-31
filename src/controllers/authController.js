import { readFile } from 'node:fs/promises';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import { isValidObjectId } from 'mongoose';
import User from '../models/user.js';
import Session from '../models/session.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import { sendWelcomeEmail } from '../services/email.js';
import { sendEmail } from '../utils/sendMail.js';

const PASSWORD_RESET_SUCCESS_MESSAGE = 'Password reset email sent successfully';

const loadResetPasswordTemplate = async () => {
  const templatePath = new URL('../templates/reset-password-email.html', import.meta.url);
  const source = await readFile(templatePath, 'utf-8');
  return handlebars.compile(source);
};

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createHttpError(400, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
  });

  const session = await createSession(user._id);
  setSessionCookies(res, session);

  try {
    await sendWelcomeEmail(user.email);
  } catch (error) {
    req.log?.error({ err: error }, 'Failed to send welcome email');
  }

  res.status(201).json(user);
};

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  if (!sessionId || !refreshToken || !isValidObjectId(sessionId)) {
    throw createHttpError(401, 'Session not found');
  }

  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session token expired');
  }

  await Session.deleteOne({ _id: session._id });

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({
    message: 'Session refreshed',
  });
};

export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId && isValidObjectId(sessionId)) {
    await Session.deleteOne({ _id: sessionId });
  }

  const clearCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  res.clearCookie('sessionId', clearCookieOptions);
  res.clearCookie('accessToken', clearCookieOptions);
  res.clearCookie('refreshToken', clearCookieOptions);

  res.status(204).send();
};

export const requestResetEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      message: PASSWORD_RESET_SUCCESS_MESSAGE,
    });
  }

  const jwtSecret = process.env.JWT_SECRET;
  const frontendDomain = process.env.FRONTEND_DOMAIN;

  if (!jwtSecret || !frontendDomain) {
    throw createHttpError(500, 'Server is not configured for password reset emails.');
  }

  const token = jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
    },
    jwtSecret,
    { expiresIn: '15m' },
  );

  const resetLink = `${frontendDomain.replace(/\/$/, '')}/reset-password?token=${token}`;
  const compileTemplate = await loadResetPasswordTemplate();
  const html = compileTemplate({
    name: user.username || user.email,
    resetLink,
  });

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password reset request',
      html,
      text: `Reset your password using this link: ${resetLink}`,
    });
  } catch (error) {
    req.log?.error({ err: error }, 'Failed to send reset password email');
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }

  return res.status(200).json({
    message: PASSWORD_RESET_SUCCESS_MESSAGE,
  });
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw createHttpError(500, 'Server is not configured for password reset.');
  }

  let payload;

  try {
    payload = jwt.verify(token, jwtSecret);
  } catch {
    throw createHttpError(401, 'Invalid or expired token');
  }

  const { sub, email } = payload;
  const user = await User.findOne({ _id: sub, email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();

  return res.status(200).json({
    message: 'Password reset successfully',
  });
};

export const uploadAvatar = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, 'Avatar file is required');
  }

  const avatarUrl = `/uploads/avatars/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatarUrl },
    { new: true },
  );

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  return res.status(200).json({
    message: 'Avatar uploaded successfully',
    avatarUrl: user.avatarUrl,
  });
};
