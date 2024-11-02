import { UUID } from "@repo/utils/types";

export interface DecodeJWT {
  id: UUID;
  isLender: boolean;
  isBorrower: boolean;
  isSupport: boolean;
  iat: number;
  exp: number;
  refreshTokenExpireTime: number;
}
