export interface IContextResult {
  accessToken: string;
  cookies?: string;
  refreshToken: string;
  accessTokenHeader?: string;
  sessionId?: string;
}

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
