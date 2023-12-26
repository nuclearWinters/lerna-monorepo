import { AuthClient } from "./proto/auth_grpc_pb";
import { JWTMiddlewareInput, JWTMiddlewarePayload } from "./proto/auth_pb";
import { credentials } from "@grpc/grpc-js";

export interface IContextResult {
  accessToken: string;
  cookies: string;
  refreshToken: string;
  accessTokenHeader?: string;
  extensions: unknown;
}

export const setExtensionsContext = (
  ctx: unknown,
  extensions: unknown
): IContextResult => {
  const ctxTyped = ctx as IContextResult;
  ctxTyped.extensions = extensions;
  return ctxTyped;
};

export const client = new AuthClient(
  `backend-auth:1983`,
  credentials.createInsecure()
);

export const jwtMiddleware = (
  refreshToken: string,
  accessToken: string
): Promise<JWTMiddlewarePayload> => {
  return new Promise<JWTMiddlewarePayload>((resolve, reject) => {
    const request = new JWTMiddlewareInput();
    request.setRefreshtoken(refreshToken);
    request.setAccesstoken(accessToken);

    client.jwtMiddleware(request, (err, user) => {
      if (err) {
        const error = new Error(err.message);
        reject(error);
      } else {
        resolve(user);
      }
    });
  });
};
