// package: authPackage
// file: auth.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as auth_pb from "./auth_pb.js";

interface IAuthService
  extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  renewAccessToken: IAuthService_IrenewAccessToken;
  createUser: IAuthService_IcreateUser;
}

interface IAuthService_IrenewAccessToken
  extends grpc.MethodDefinition<
    auth_pb.RenewAccessTokenInput,
    auth_pb.RenewAccessTokenPayload
  > {
  path: "/authPackage.Auth/renewAccessToken";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<auth_pb.RenewAccessTokenInput>;
  requestDeserialize: grpc.deserialize<auth_pb.RenewAccessTokenInput>;
  responseSerialize: grpc.serialize<auth_pb.RenewAccessTokenPayload>;
  responseDeserialize: grpc.deserialize<auth_pb.RenewAccessTokenPayload>;
}
interface IAuthService_IcreateUser
  extends grpc.MethodDefinition<
    auth_pb.CreateUserInput,
    auth_pb.CreateUserPayload
  > {
  path: "/authPackage.Auth/createUser";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<auth_pb.CreateUserInput>;
  requestDeserialize: grpc.deserialize<auth_pb.CreateUserInput>;
  responseSerialize: grpc.serialize<auth_pb.CreateUserPayload>;
  responseDeserialize: grpc.deserialize<auth_pb.CreateUserPayload>;
}

export const AuthService: IAuthService;

export interface IAuthServer extends grpc.UntypedServiceImplementation {
  renewAccessToken: grpc.handleUnaryCall<
    auth_pb.RenewAccessTokenInput,
    auth_pb.RenewAccessTokenPayload
  >;
  createUser: grpc.handleUnaryCall<
    auth_pb.CreateUserInput,
    auth_pb.CreateUserPayload
  >;
}

export interface IAuthClient {
  renewAccessToken(
    request: auth_pb.RenewAccessTokenInput,
    callback: (
      error: grpc.ServiceError | null,
      response: auth_pb.RenewAccessTokenPayload
    ) => void
  ): grpc.ClientUnaryCall;
  renewAccessToken(
    request: auth_pb.RenewAccessTokenInput,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: auth_pb.RenewAccessTokenPayload
    ) => void
  ): grpc.ClientUnaryCall;
  renewAccessToken(
    request: auth_pb.RenewAccessTokenInput,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: auth_pb.RenewAccessTokenPayload
    ) => void
  ): grpc.ClientUnaryCall;
  createUser(
    request: auth_pb.CreateUserInput,
    callback: (
      error: grpc.ServiceError | null,
      response: auth_pb.CreateUserPayload
    ) => void
  ): grpc.ClientUnaryCall;
  createUser(
    request: auth_pb.CreateUserInput,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: auth_pb.CreateUserPayload
    ) => void
  ): grpc.ClientUnaryCall;
  createUser(
    request: auth_pb.CreateUserInput,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: auth_pb.CreateUserPayload
    ) => void
  ): grpc.ClientUnaryCall;
}

export class AuthClient extends grpc.Client implements IAuthClient {
  constructor(
    address: string,
    credentials: grpc.ChannelCredentials,
    options?: Partial<grpc.ClientOptions>
  );
  public renewAccessToken(
    request: auth_pb.RenewAccessTokenInput,
    callback: (
      error: grpc.ServiceError | null,
      response: auth_pb.RenewAccessTokenPayload
    ) => void
  ): grpc.ClientUnaryCall;
  public renewAccessToken(
    request: auth_pb.RenewAccessTokenInput,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: auth_pb.RenewAccessTokenPayload
    ) => void
  ): grpc.ClientUnaryCall;
  public renewAccessToken(
    request: auth_pb.RenewAccessTokenInput,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: auth_pb.RenewAccessTokenPayload
    ) => void
  ): grpc.ClientUnaryCall;
  public createUser(
    request: auth_pb.CreateUserInput,
    callback: (
      error: grpc.ServiceError | null,
      response: auth_pb.CreateUserPayload
    ) => void
  ): grpc.ClientUnaryCall;
  public createUser(
    request: auth_pb.CreateUserInput,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: auth_pb.CreateUserPayload
    ) => void
  ): grpc.ClientUnaryCall;
  public createUser(
    request: auth_pb.CreateUserInput,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: auth_pb.CreateUserPayload
    ) => void
  ): grpc.ClientUnaryCall;
}
