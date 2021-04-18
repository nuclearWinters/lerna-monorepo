import jsonwebtoken, { SignOptions } from "jsonwebtoken";
import { DecodeJWT } from "./types";

export const jwt = {
  decode: (token: string): string | DecodeJWT | null => {
    const decoded = jsonwebtoken.decode(token);
    return decoded as string | DecodeJWT | null;
  },
  verify: (token: string, password: string): Promise<DecodeJWT | undefined> => {
    return new Promise((resolve, reject) => {
      jsonwebtoken.verify(token, password, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded as DecodeJWT | undefined);
      });
    });
  },
  sign: (
    data: { _id: string },
    secret: string,
    options: SignOptions
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      jsonwebtoken.sign(data, secret, options, (err, token) => {
        if (err) {
          return reject(err);
        }
        if (token === undefined) {
          return reject(new Error("Token is undefined"));
        }
        resolve(token);
      });
    });
  },
};
