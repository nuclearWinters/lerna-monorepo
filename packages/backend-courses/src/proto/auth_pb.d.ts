// package: authPackage
// file: auth.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class RenewAccessTokenInput extends jspb.Message { 
    getRefreshtoken(): string;
    setRefreshtoken(value: string): RenewAccessTokenInput;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RenewAccessTokenInput.AsObject;
    static toObject(includeInstance: boolean, msg: RenewAccessTokenInput): RenewAccessTokenInput.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RenewAccessTokenInput, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RenewAccessTokenInput;
    static deserializeBinaryFromReader(message: RenewAccessTokenInput, reader: jspb.BinaryReader): RenewAccessTokenInput;
}

export namespace RenewAccessTokenInput {
    export type AsObject = {
        refreshtoken: string,
    }
}

export class RenewAccessTokenPayload extends jspb.Message { 
    getValidaccesstoken(): string;
    setValidaccesstoken(value: string): RenewAccessTokenPayload;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RenewAccessTokenPayload.AsObject;
    static toObject(includeInstance: boolean, msg: RenewAccessTokenPayload): RenewAccessTokenPayload.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RenewAccessTokenPayload, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RenewAccessTokenPayload;
    static deserializeBinaryFromReader(message: RenewAccessTokenPayload, reader: jspb.BinaryReader): RenewAccessTokenPayload;
}

export namespace RenewAccessTokenPayload {
    export type AsObject = {
        validaccesstoken: string,
    }
}
