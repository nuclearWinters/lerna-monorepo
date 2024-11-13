import type { UUID } from "node:crypto";

export interface DecodeJWT {
  id: UUID;
  isLender: boolean;
  isBorrower: boolean;
  isSupport: boolean;
  iat: number;
  exp: number;
  refreshTokenExpireTime: number;
}
