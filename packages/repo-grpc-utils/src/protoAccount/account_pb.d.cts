// package: accountPackage
// file: account.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class CreateUserInput extends jspb.Message {
  getId(): string;
  setId(value: string): CreateUserInput;

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
    id: string;
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
