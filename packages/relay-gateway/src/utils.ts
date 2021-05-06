export interface IContextResult {
  authorization?: string;
  cookies: {
    refreshToken?: string;
  };
  refreshToken: string;
}

export const getContext = (ctx: any): IContextResult => {
  return {
    authorization: ctx?.req?.headers?.authorization,
    cookies: ctx?.req?.cookies,
    refreshToken: ctx?.refreshToken,
  };
};
