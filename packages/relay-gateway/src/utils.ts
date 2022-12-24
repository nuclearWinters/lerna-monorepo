import { Request } from "express";

export interface IContextResult {
  accessToken: string;
  cookies?: string;
  refreshToken: string;
  accessTokenHeader?: string;
}

export const getContext = (ctx: unknown): IContextResult => {
  const ctxTyped = ctx as { req?: Request } | undefined;
  return {
    accessToken: ctxTyped?.req?.headers.authorization || "",
    refreshToken: ctxTyped?.req?.cookies.refreshToken || "",
  };
};

export const setCookieContext = (
  ctx: unknown,
  cookies: string
): IContextResult => {
  const ctxTyped = ctx as IContextResult;
  ctxTyped.cookies = cookies;
  return ctxTyped;
};

export const setTokenContext = (
  ctx: unknown,
  accessTokenHeader: string
): IContextResult => {
  const ctxTyped = ctx as IContextResult;
  ctxTyped.accessTokenHeader = accessTokenHeader;
  return ctxTyped;
};
