// package: authPackage
// file: auth.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class JWTMiddlewareInput extends jspb.Message {
  getRefreshtoken(): string;
  setRefreshtoken(value: string): JWTMiddlewareInput;
  getAccesstoken(): string;
  setAccesstoken(value: string): JWTMiddlewareInput;

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
    refreshtoken: string;
    accesstoken: string;
  };
}

export class JWTMiddlewarePayload extends jspb.Message {
  getValidaccesstoken(): string;
  setValidaccesstoken(value: string): JWTMiddlewarePayload;
  getId(): string;
  setId(value: string): JWTMiddlewarePayload;
  getIslender(): boolean;
  setIslender(value: boolean): JWTMiddlewarePayload;
  getIsborrower(): boolean;
  setIsborrower(value: boolean): JWTMiddlewarePayload;
  getIssupport(): boolean;
  setIssupport(value: boolean): JWTMiddlewarePayload;

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
    validaccesstoken: string;
    id: string;
    islender: boolean;
    isborrower: boolean;
    issupport: boolean;
  };
}

export class CreateUserInput extends jspb.Message {
  getNanoid(): string;
  setNanoid(value: string): CreateUserInput;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateUserInput.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: CreateUserInput
  ): CreateUserInput.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: CreateUserInput,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): CreateUserInput;
  static deserializeBinaryFromReader(
    message: CreateUserInput,
    reader: jspb.BinaryReader
  ): CreateUserInput;
}

export namespace CreateUserInput {
  export type AsObject = {
    nanoid: string;
  };
}

export class CreateUserPayload extends jspb.Message {
  getDone(): string;
  setDone(value: string): CreateUserPayload;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateUserPayload.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: CreateUserPayload
  ): CreateUserPayload.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: CreateUserPayload,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): CreateUserPayload;
  static deserializeBinaryFromReader(
    message: CreateUserPayload,
    reader: jspb.BinaryReader
  ): CreateUserPayload;
}

export namespace CreateUserPayload {
  export type AsObject = {
    done: string;
  };
}
