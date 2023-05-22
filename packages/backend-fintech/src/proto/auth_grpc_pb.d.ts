// package: authPackage
// file: auth.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as auth_pb from "./auth_pb";

interface IAuthService
  extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  jwtMiddleware: IAuthService_IjwtMiddleware;
  createUser: IAuthService_IcreateUser;
}

interface IAuthService_IjwtMiddleware
  extends grpc.MethodDefinition<
    auth_pb.JWTMiddlewareInput,
    auth_pb.JWTMiddlewarePayload
  > {
  path: "/authPackage.Auth/jwtMiddleware";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<auth_pb.JWTMiddlewareInput>;
  requestDeserialize: grpc.deserialize<auth_pb.JWTMiddlewareInput>;
  responseSerialize: grpc.serialize<auth_pb.JWTMiddlewarePayload>;
  responseDeserialize: grpc.deserialize<auth_pb.JWTMiddlewarePayload>;
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
  jwtMiddleware: grpc.handleUnaryCall<
    auth_pb.JWTMiddlewareInput,
    auth_pb.JWTMiddlewarePayload
  >;
  createUser: grpc.handleUnaryCall<
    auth_pb.CreateUserInput,
    auth_pb.CreateUserPayload
  >;
}

export interface IAuthClient {
  jwtMiddleware(
    request: auth_pb.JWTMiddlewareInput,
    callback: (
      error: grpc.ServiceError | null,
      response: auth_pb.JWTMiddlewarePayload
    ) => void
  ): grpc.ClientUnaryCall;
  jwtMiddleware(
    request: auth_pb.JWTMiddlewareInput,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: auth_pb.JWTMiddlewarePayload
    ) => void
  ): grpc.ClientUnaryCall;
  jwtMiddleware(
    request: auth_pb.JWTMiddlewareInput,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: auth_pb.JWTMiddlewarePayload
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
  public jwtMiddleware(
    request: auth_pb.JWTMiddlewareInput,
    callback: (
      error: grpc.ServiceError | null,
      response: auth_pb.JWTMiddlewarePayload
    ) => void
  ): grpc.ClientUnaryCall;
  public jwtMiddleware(
    request: auth_pb.JWTMiddlewareInput,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: auth_pb.JWTMiddlewarePayload
    ) => void
  ): grpc.ClientUnaryCall;
  public jwtMiddleware(
    request: auth_pb.JWTMiddlewareInput,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: auth_pb.JWTMiddlewarePayload
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
