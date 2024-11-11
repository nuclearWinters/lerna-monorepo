import type { UUID } from "@repo/utils";

export interface DecodeJWT {
  id: UUID;
  isLender: boolean;
  isBorrower: boolean;
  isSupport: boolean;
  iat: number;
  exp: number;
  refreshTokenExpireTime: number;
}
