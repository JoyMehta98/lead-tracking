import { type CookieOptions, type Response } from "express";

export const AUTH_TOKEN_MAX_AGE = 3600000; // 1000 * 60 * 60 milliseconds = 1hr

export const REFRESH_TOKEN_MAX_AGE = 604800000; // 1000 * 60 * 60 * 24 * 7 milliseconds = 7 days

const cookieOptions: CookieOptions = {
  domain: "localhost",
  secure: true,
  httpOnly: true,
  sameSite: "none",
};

export const setRefreshToken = (res: Response, token: string) =>
  res.cookie("refreshToken", token, {
    maxAge: REFRESH_TOKEN_MAX_AGE,
    ...cookieOptions,
  });

export const setAuthToken = (res: Response, token: string) =>
  res.cookie("authToken", token, {
    maxAge: AUTH_TOKEN_MAX_AGE,
    ...cookieOptions,
  });

export const clearCookies = (res: Response) => {
  res.clearCookie("authToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
};
