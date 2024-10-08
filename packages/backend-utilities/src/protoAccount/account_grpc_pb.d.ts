// package: authPackage
// file: account.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as account_pb from "./account_pb.js";

interface IAccountService
  extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  createUser: IAccountService_IcreateUser;
}

interface IAccountService_IcreateUser
  extends grpc.MethodDefinition<
    account_pb.CreateUserInput,
    account_pb.CreateUserPayload
  > {
  path: "/authPackage.Account/createUser";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<account_pb.CreateUserInput>;
  requestDeserialize: grpc.deserialize<account_pb.CreateUserInput>;
  responseSerialize: grpc.serialize<account_pb.CreateUserPayload>;
  responseDeserialize: grpc.deserialize<account_pb.CreateUserPayload>;
}

export const AccountService: IAccountService;

export interface IAccountServer extends grpc.UntypedServiceImplementation {
  createUser: grpc.handleUnaryCall<
    account_pb.CreateUserInput,
    account_pb.CreateUserPayload
  >;
}

export interface IAccountClient {
  createUser(
    request: account_pb.CreateUserInput,
    callback: (
      error: grpc.ServiceError | null,
      response: account_pb.CreateUserPayload
    ) => void
  ): grpc.ClientUnaryCall;
  createUser(
    request: account_pb.CreateUserInput,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: account_pb.CreateUserPayload
    ) => void
  ): grpc.ClientUnaryCall;
  createUser(
    request: account_pb.CreateUserInput,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: account_pb.CreateUserPayload
    ) => void
  ): grpc.ClientUnaryCall;
}

export class AccountClient extends grpc.Client implements IAccountClient {
  constructor(
    address: string,
    credentials: grpc.ChannelCredentials,
    options?: Partial<grpc.ClientOptions>
  );
  public createUser(
    request: account_pb.CreateUserInput,
    callback: (
      error: grpc.ServiceError | null,
      response: account_pb.CreateUserPayload
    ) => void
  ): grpc.ClientUnaryCall;
  public createUser(
    request: account_pb.CreateUserInput,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: account_pb.CreateUserPayload
    ) => void
  ): grpc.ClientUnaryCall;
  public createUser(
    request: account_pb.CreateUserInput,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: account_pb.CreateUserPayload
    ) => void
  ): grpc.ClientUnaryCall;
}
