// package: authPackage
// file: auth.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class JWTMiddlewareInput extends jspb.Message {
  getRefreshToken(): string;
  setRefreshToken(value: string): JWTMiddlewareInput;
  getAccessToken(): string;
  setAccessToken(value: string): JWTMiddlewareInput;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JWTMiddlewareInput.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: JWTMiddlewareInput
  ): JWTMiddlewareInput.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: JWTMiddlewareInput,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): JWTMiddlewareInput;
  static deserializeBinaryFromReader(
    message: JWTMiddlewareInput,
    reader: jspb.BinaryReader
  ): JWTMiddlewareInput;
}

export namespace JWTMiddlewareInput {
  export type AsObject = {
    refreshToken: string;
    accessToken: string;
  };
}

export class JWTMiddlewarePayload extends jspb.Message {
  getValidAccessToken(): string;
  setValidAccessToken(value: string): JWTMiddlewarePayload;
  getId(): string;
  setId(value: string): JWTMiddlewarePayload;
  getIsLender(): boolean;
  setIsLender(value: boolean): JWTMiddlewarePayload;
  getIsBorrower(): boolean;
  setIsBorrower(value: boolean): JWTMiddlewarePayload;
  getIsSupport(): boolean;
  setIsSupport(value: boolean): JWTMiddlewarePayload;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JWTMiddlewarePayload.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: JWTMiddlewarePayload
  ): JWTMiddlewarePayload.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: JWTMiddlewarePayload,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): JWTMiddlewarePayload;
  static deserializeBinaryFromReader(
    message: JWTMiddlewarePayload,
    reader: jspb.BinaryReader
  ): JWTMiddlewarePayload;
}

export namespace JWTMiddlewarePayload {
  export type AsObject = {
    validAccessToken: string;
    id: string;
    isLender: boolean;
    isBorrower: boolean;
    isSupport: boolean;
  };
}
