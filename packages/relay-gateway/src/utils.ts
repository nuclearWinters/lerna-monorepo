export interface IContextResult {
  authorization?: string;
}

export const getContext = (ctx: any): IContextResult => {
  return {
    authorization: ctx?.req?.headers?.authorization,
  };
};
