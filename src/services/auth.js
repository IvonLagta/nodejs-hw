import crypto from 'node:crypto';
import Session from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';

const createToken = () => crypto.randomBytes(30).toString('hex');

export const createSession = async (userId) => {
  const accessToken = createToken();
  const refreshToken = createToken();
  const now = Date.now();

  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(now + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(now + ONE_DAY),
  });

  return session;
};

export const setSessionCookies = (res, session) => {
  const baseCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  res.cookie('accessToken', session.accessToken, {
    ...baseCookieOptions,
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie('refreshToken', session.refreshToken, {
    ...baseCookieOptions,
    maxAge: ONE_DAY,
  });

  res.cookie('sessionId', session._id.toString(), {
    ...baseCookieOptions,
    maxAge: ONE_DAY,
  });
};
